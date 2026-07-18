#include <string>
#include <stdexcept>
#include "BarcodeFormat.h"
#include "CreateBarcode.h"
#include "WriteBarcode.h"
#include "js-error.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>

EMSCRIPTEN_DECLARE_VAL_TYPE(ImageResult);
EMSCRIPTEN_DECLARE_VAL_TYPE(WriterBarcodeFormatArg);

static bool isWritableFormat(ZXing::BarcodeFormat format)
{
    switch (format)
    {
#define ZX_(NAME, SYM, VAR, FLAGS, ZINT, ENABLED, HRI) \
    case ZXing::BarcodeFormat::NAME:                    \
        return (ZINT) != 0 && (ENABLED);
        ZX_BCF_LIST(ZX_)
#undef ZX_
    }
    return false;
}

static ZXing::BarcodeFormat parseWriterBarcodeFormat(const WriterBarcodeFormatArg &value)
{
    auto description = value.as<std::string>();
    ZXing::BarcodeFormat format;
    try
    {
        format = ZXing::BarcodeFormatFromString(description);
    }
    catch (const std::exception &error)
    {
        throwTypeError(error.what());
    }
    if (!isWritableFormat(format))
    {
        throwTypeError("Barcode format is not writable: '" + description + "'");
    }
    return format;
}

static ZXing::WriterOptions makeWriterOptions(int scale, int rotate, bool withHRT, bool withQuietZones)
{
    return ZXing::WriterOptions()
        .scale(scale)
        .rotate(rotate)
        .addHRT(withHRT)
        .addQuietZones(withQuietZones);
}

std::string writeBarcodeToSVG(
    const std::string &text,
    WriterBarcodeFormatArg format,
    const std::string &creatorOptions,
    int scale,
    int rotate,
    bool withHRT,
    bool withQuietZones)
{
    auto cOpts = ZXing::CreatorOptions(parseWriterBarcodeFormat(format), creatorOptions);
    auto barcode = ZXing::CreateBarcodeFromText(text, cOpts);
    auto wOpts = makeWriterOptions(scale, rotate, withHRT, withQuietZones);
    return ZXing::WriteBarcodeToSVG(barcode, wOpts);
}

ImageResult writeBarcodeToImage(
    const std::string &text,
    WriterBarcodeFormatArg format,
    const std::string &creatorOptions,
    int scale,
    int rotate,
    bool withHRT,
    bool withQuietZones)
{
    auto cOpts = ZXing::CreatorOptions(parseWriterBarcodeFormat(format), creatorOptions);
    auto barcode = ZXing::CreateBarcodeFromText(text, cOpts);
    auto wOpts = makeWriterOptions(scale, rotate, withHRT, withQuietZones);
    auto image = ZXing::WriteBarcodeToImage(barcode, wOpts);

    thread_local const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

    int dataSize = image.width() * image.height();
    emscripten::val result = emscripten::val::object();
    result.set("width", image.width());
    result.set("height", image.height());
    // Copy the image data into a new JS Uint8Array so it is not tied to WASM memory
    result.set("data", Uint8Array.new_(emscripten::typed_memory_view(dataSize, image.data())));
    return static_cast<ImageResult>(result);
}

std::string writeBarcodeToUtf8(
    const std::string &text,
    WriterBarcodeFormatArg format,
    const std::string &creatorOptions,
    int scale,
    int rotate,
    bool withHRT,
    bool withQuietZones)
{
    auto cOpts = ZXing::CreatorOptions(parseWriterBarcodeFormat(format), creatorOptions);
    auto barcode = ZXing::CreateBarcodeFromText(text, cOpts);
    auto wOpts = makeWriterOptions(scale, rotate, withHRT, withQuietZones);
    return ZXing::WriteBarcodeToUtf8(barcode, wOpts);
}

EMSCRIPTEN_BINDINGS(ZxingWriter)
{
    using namespace emscripten;

    auto writerBarcodeFormat = enum_<ZXing::BarcodeFormat>("WriterBarcodeFormat", enum_value_type::string);
#define ZX_(NAME, SYM, VAR, FLAGS, ZINT, ENABLED, HRI) \
    if constexpr ((ZINT) != 0 && (ENABLED))             \
        writerBarcodeFormat.value(#NAME, ZXing::BarcodeFormat::NAME);
    ZX_BCF_LIST(ZX_)
#undef ZX_

    register_type<WriterBarcodeFormatArg>("WriterBarcodeFormat");

    register_type<ImageResult>("{ width: number; height: number; data: Uint8Array }");

    function("writeBarcodeToSVG", &writeBarcodeToSVG);
    function("writeBarcodeToImage", &writeBarcodeToImage);
    function("writeBarcodeToUtf8", &writeBarcodeToUtf8);
}
