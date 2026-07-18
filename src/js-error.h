#pragma once

#include <string>
#include <emscripten.h>

EM_JS(void, zxingThrowTypeError, (const char *message), {
    throw new TypeError(UTF8ToString(message));
});

[[noreturn]] inline void throwTypeError(const std::string &message)
{
    zxingThrowTypeError(message.c_str());
    __builtin_unreachable();
}
