#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${PROJECT_ROOT}/build"

export EM_CACHE="${EM_CACHE:-${PROJECT_ROOT}/.cache/emscripten}"
mkdir -p "${EM_CACHE}"

emcmake cmake \
    -S "${PROJECT_ROOT}" \
    -B "${BUILD_DIR}" \
    -G Ninja \
    -DCMAKE_BUILD_TYPE=Release

cmake --build "${BUILD_DIR}" --config Release --parallel
