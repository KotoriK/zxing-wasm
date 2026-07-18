#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${PROJECT_ROOT}/build"
EMSCRIPTEN_VERSION_FILE="${PROJECT_ROOT}/.emscripten-version"

export EM_CACHE="${EM_CACHE:-${PROJECT_ROOT}/.cache/emscripten}"
mkdir -p "${EM_CACHE}"

if ! command -v emcc >/dev/null 2>&1; then
    echo "error: emcc is required; expected Emscripten $(<"${EMSCRIPTEN_VERSION_FILE}")" >&2
    exit 1
fi

EXPECTED_EMSCRIPTEN_VERSION="$(<"${EMSCRIPTEN_VERSION_FILE}")"
ACTUAL_EMSCRIPTEN_VERSION="$(emcc -dumpversion)"
ACTUAL_EMSCRIPTEN_VERSION="${ACTUAL_EMSCRIPTEN_VERSION%-git}"

if [[ "${ACTUAL_EMSCRIPTEN_VERSION}" != "${EXPECTED_EMSCRIPTEN_VERSION}" ]]; then
    echo "error: Emscripten ${EXPECTED_EMSCRIPTEN_VERSION} required; found ${ACTUAL_EMSCRIPTEN_VERSION}" >&2
    exit 1
fi

emcmake cmake \
    -S "${PROJECT_ROOT}" \
    -B "${BUILD_DIR}" \
    -G Ninja \
    -DCMAKE_BUILD_TYPE=Release

cmake --build "${BUILD_DIR}" --config Release --parallel
node "${PROJECT_ROOT}/scripts/enrich_barcode_format_types.js" \
    "${PROJECT_ROOT}/wasm-out/reader/zxing_reader.d.ts"
