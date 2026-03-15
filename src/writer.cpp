#include <string>
#include <stdexcept>
#include "BarcodeFormat.h"
#include "CreateBarcode.h"
#include "WriteBarcode.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>

EMSCRIPTEN_DECLARE_VAL_TYPE(ImageResult);

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
    const std::string &format,
    const std::string &creatorOptions,
    int scale,
    int rotate,
    bool withHRT,
    bool withQuietZones)
{
    auto barcodeFormat = ZXing::BarcodeFormatFromString(format);
    if (barcodeFormat == ZXing::BarcodeFormat::None)
        throw std::invalid_argument("Unsupported format: " + format);

    auto cOpts = ZXing::CreatorOptions(barcodeFormat, creatorOptions);
    auto barcode = ZXing::CreateBarcodeFromText(text, cOpts);
    auto wOpts = makeWriterOptions(scale, rotate, withHRT, withQuietZones);
    return ZXing::WriteBarcodeToSVG(barcode, wOpts);
}

ImageResult writeBarcodeToImage(
    const std::string &text,
    const std::string &format,
    const std::string &creatorOptions,
    int scale,
    int rotate,
    bool withHRT,
    bool withQuietZones)
{
    auto barcodeFormat = ZXing::BarcodeFormatFromString(format);
    if (barcodeFormat == ZXing::BarcodeFormat::None)
        throw std::invalid_argument("Unsupported format: " + format);

    auto cOpts = ZXing::CreatorOptions(barcodeFormat, creatorOptions);
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
    const std::string &format,
    const std::string &creatorOptions,
    int scale,
    int rotate,
    bool withHRT,
    bool withQuietZones)
{
    auto barcodeFormat = ZXing::BarcodeFormatFromString(format);
    if (barcodeFormat == ZXing::BarcodeFormat::None)
        throw std::invalid_argument("Unsupported format: " + format);

    auto cOpts = ZXing::CreatorOptions(barcodeFormat, creatorOptions);
    auto barcode = ZXing::CreateBarcodeFromText(text, cOpts);
    auto wOpts = makeWriterOptions(scale, rotate, withHRT, withQuietZones);
    return ZXing::WriteBarcodeToUtf8(barcode, wOpts);
}

EMSCRIPTEN_BINDINGS(ZxingWriter)
{
    using namespace emscripten;

    register_type<ImageResult>("{ width: number; height: number; data: Uint8Array }");

    function("writeBarcodeToSVG", &writeBarcodeToSVG);
    function("writeBarcodeToImage", &writeBarcodeToImage);
    function("writeBarcodeToUtf8", &writeBarcodeToUtf8);
}
