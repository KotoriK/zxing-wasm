#include <emscripten/bind.h>
#include <Version.h>

EMSCRIPTEN_BINDINGS(Version)
{
    using namespace emscripten;
    constexpr const char *DESCR = "ZXing " ZXING_VERSION_STR "\n"
/* "C++:" std::string(__cplusplus) '\n' */
#ifdef __wasm_simd128__
                                  "WASMSIMD "
#endif
#ifdef __wasm_relaxed_simd__
                                  "RELAXEDSIMD "
#endif
#ifdef __AVX__
                                  "AVX ";
#endif
    constant("DESCR", std::string(DESCR));
}
#ifdef ZXING_READERS
#include "reader.cpp"
#endif