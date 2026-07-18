# ADR-0001：保持 reader 与 writer 为独立 Wasm target

- 状态：已接受
- 日期：2026-07-18
- 适用版本：Emscripten 6.0.3

## 背景

项目分别构建 `zxing_reader` 与 `zxing_writer`。这样允许使用方只下载、初始化所需能力，但两套 Emscripten 模块会重复携带一部分 JavaScript glue、Wasm imports 和通用 C++/运行时代码。

本次调查比较三种结构：

1. 两个独立 target；
2. 单一 reader+writer combined module；
3. 一个 main module 加 reader、writer 两个 side module。

所有体积数据均来自 Emscripten 6.0.3、Release、`-O3`、SIMD 构建。Brotli 使用 quality 11。PoC 产物只用于调查，没有加入仓库。

## 重复情况

独立模块的 Wasm imports：

- reader：82 个；
- writer：68 个；
- 语义相同的 imports：56 个。

重复项主要来自异常处理、Embind/Emval、invoke shim、运行环境和内存增长函数。重复不只存在于 import 声明；两个独立模块也分别携带对应 JavaScript 实现及部分通用 Wasm 代码。

## 体积对比

| 方案 | Raw bytes | Brotli bytes | 相对独立 target |
|---|---:|---:|---:|
| reader + writer 独立 target | 1,676,967 | 614,028 | 基线 |
| combined module | 1,461,212 | 538,684 | -12.27% |
| load-time main + 两个 side | 1,613,087 | 557,234 | -9.25% |

只使用单项能力时：

- reader 独立产物：334,735 Brotli bytes；
- writer 独立产物：279,293 Brotli bytes；
- combined 或 load-time main+side 会下载另一侧代码，因此明显更大。

## Main/side 与 Embind 调查

### Load-time linking

main 在链接时显式包含两个 side module 的方案通过了验证：

- `MAIN_MODULE=2` / `SIDE_MODULE=2`；
- `EMBIND_AOT=1`；
- `DYNAMIC_EXECUTION=0`；
- `--emit-tsd` 能生成包含 reader 与 writer 的声明；
- writer 生成 QR、reader 解码的端到端测试通过。

该方案技术上可用，但两个 side 会在初始化阶段全部加载。它无法保持当前 reader/writer 独立下载和独立初始化的行为。

### Lazy runtime linking

按需加载 side module 与当前 Embind 配置不兼容：

1. main 构建时不知道 side bindings，运行时加载 reader side 会失败：

   ```text
   InvokerFunctions[signature] is not a function
   ```

   `EMBIND_AOT` 只为构建时已知的 binding signature 生成 JavaScript invoker。

2. 链接时提供 side、同时设置 `AUTOLOAD_DYLIBS=0`，Emscripten 6.0.3 会在 AOT/type-generation 阶段失败，无法作为简单的“构建时可见、运行时懒加载”方案。

3. 关闭 AOT、允许 Embind runtime JIT 后，lazy loading 可以工作，但代价是：

   - 需要动态代码执行，与当前 `DYNAMIC_EXECUTION=0`/CSP 目标冲突；
   - runtime `MAIN_MODULE=1` 需要保留更多 JS 和系统库，且与当前 `FILESYSTEM=0` 配置冲突；
   - PoC 总量约 761 KB Brotli，比两个独立 target 大约 24%；
   - side API 无法自然进入 main 的自动生成 TypeScript 声明。

Emscripten 官方文档也指出，main module 负责系统库和 JavaScript 环境；runtime dynamic linking 需要额外处理系统库、文件系统和符号保活：

- [Dynamic Linking](https://emscripten.org/docs/compiling/Dynamic-Linking.html)
- [Compiler Settings](https://emscripten.org/docs/tools_reference/settings_reference.html)
- [Embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html)

## 决策

保持 `zxing_reader` 与 `zxing_writer` 为两个独立 target。不采用 combined module，也不采用 main+side module。

理由：

- 使用方可以只下载所需能力；
- 保持 `readerInit`、`writerInit` 及两个 Wasm asset 的独立模型；
- 不引入动态链接、符号保活、side asset 定位和共享 Module 生命周期管理；
- 保持 `EMBIND_AOT=1` 与 `DYNAMIC_EXECUTION=0`；
- 避免 runtime JIT、文件系统和 CSP 退化；
- main+side 仅在同时使用两项能力时节省约 9.25%，不足以抵消复杂度和单项下载退化。

## 后果

- 接受两套 Emscripten glue 和部分通用 Wasm 代码重复。
- 同时使用 reader 与 writer 的页面，比理论 combined module 多下载约 12.27% Brotli 数据。
- 两个模块拥有独立 Wasm memory、table 和 Embind runtime；对象不可跨模块传递。
- 构建、发布和消费 API 继续保持简单、显式、可独立缓存。

## 重新评估条件

满足任一条件时可重新调查：

- 实际使用数据表明绝大多数使用方总是同时加载 reader 与 writer；
- Emscripten 支持不依赖 runtime JIT 的 Embind side-module 懒加载，并能稳定生成完整 TypeScript 声明；
- 重复产物占比显著增长；
- 项目计划进行允许共享 Module/API 变更的主版本升级。
