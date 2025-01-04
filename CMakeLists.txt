# https://github.com/Sec-ant/zxing-wasm/blob/bffbf9db1ed288a9a5328917e95b7838775f7c99/src/cpp/CMakeLists.txt
# Minimum required version and project name
cmake_minimum_required(VERSION 3.14)
project(ZXingWasm)

set(UPSTREAM_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/upstream/zxing-cpp)
set(ENTRYPOINT ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp)
# Include custom cmake modules and add packages

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)

# Disable examples
set(ZXING_EXAMPLES OFF)

# Build options
set(ZXING_READERS ON)
# set(ZXING_WRITERS "NEW")
set(ZXING_WRITERS OFF)

set(ZXING_EXPERIMENTAL_API ON)
set(ZXING_USE_BUNDLED_ZINT ON)

# OPTIMIZE
set(OPT_SIMD ON)
set(OPT_RELAXED_SIMD OFF)


# Build environment
set(ZXING_EMSCRIPTEN_ENVIRONMENT "web,worker")

# Default build type
set(CMAKE_BUILD_TYPE "Release")

# Set compiler flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} \
  -fexceptions \
  -s DISABLE_EXCEPTION_CATCHING=0")

# Set linker flags
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} \
  -lembind \
  -fexceptions \
  --emit-tsd interface.d.ts \
  -s DISABLE_EXCEPTION_CATCHING=0 \
  -s ENVIRONMENT=${ZXING_EMSCRIPTEN_ENVIRONMENT} \
  -s FILESYSTEM=0 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s DYNAMIC_EXECUTION=0 \
  -s EXPORT_NAME=ZXing \
  -s EXPORTED_FUNCTIONS=\"['_malloc', '_free']\" \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s WASM_BIGINT=1 \
  -s EMIT_EMSCRIPTEN_LICENSE=1"
)

if(OPT_SIMD)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -msimd128")
endif()
if(OPT_RELAXED_SIMD)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -mrelaxed-simd")
endif()



# Test compiler with a simple HelloWorld code and print out if error occurred
file(WRITE ${CMAKE_BINARY_DIR}/test_helloworld.cpp "
#include <iostream>
int main() {
    std::cout << \"Hello, World!\" << std::endl;
    return 0;
}
")

try_compile(COMPILE_SUCCESS ${CMAKE_BINARY_DIR} 
  SOURCES ${CMAKE_BINARY_DIR}/test_helloworld.cpp 
  OUTPUT_VARIABLE COMPILE_OUTPUT)

if(NOT COMPILE_SUCCESS)
  message(FATAL_ERROR "Compiler test failed: ${COMPILE_OUTPUT}")
endif()

# Add subdirectories
add_subdirectory(${UPSTREAM_ROOT}/core ${CMAKE_BINARY_DIR}/ZXing)
# Build targets
if(ZXING_READERS AND (ZXING_WRITERS MATCHES "NEW"))
  add_executable(zxing_full ${ENTRYPOINT})
  target_compile_definitions(zxing_full PRIVATE READER WRITER)
  target_link_libraries(zxing_full ZXing::ZXing )
  set_target_properties(zxing_full PROPERTIES 
                        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/../full")
endif()

if(ZXING_READERS)
  add_executable(zxing_reader ${ENTRYPOINT})
  target_compile_definitions(zxing_reader PRIVATE READER)
  target_link_libraries(zxing_reader ZXing::ZXing )
  set_target_properties(zxing_reader PROPERTIES 
                        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/dist/reader")
endif()

if(ZXING_WRITERS MATCHES "NEW")
  add_executable(zxing_writer ${ENTRYPOINT})
  target_compile_definitions(zxing_writer PRIVATE WRITER)
  target_link_libraries(zxing_writer ZXing::ZXing )
  set_target_properties(zxing_writer PROPERTIES 
                        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/../writer")
endif()