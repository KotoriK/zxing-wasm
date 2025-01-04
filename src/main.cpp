#include <string>
#include <vector>
#include <algorithm>
#include <type_traits>
#include "Zxing/ReadBarcode.h"
#include <emscripten/bind.h>
#include <pthread.h>
#if ZXING_READERS
template <typename T, typename = std::enable_if_t<std::is_arithmetic_v<T>>>
struct Rect
{
    T x;
    T y;
    T w;
    T h;
};

class ReadResult
{
public:
    inline std::string getText() const
    {
        return barcode.text();
    };
    inline std::string getFormat() const
    {
        return ZXing::ToString(barcode.format());
    }
    inline std::string getECLevel() const
    {
        return barcode.ecLevel();
    }
    inline bool hasECI() const
    {
        return barcode.hasECI();
    }
    inline Rect<int> getRect() const
    {
        auto pos = barcode.position();
        auto pointTopLeft = pos.topLeft();
        Rect<int> rect = {
            .x = pointTopLeft.x,
            .y = pointTopLeft.y,
            .w = pos.topRight().x - pointTopLeft.x,
            .h = pos.bottomRight().y - pointTopLeft.y};
        return rect;
    }
    ReadResult(ZXing::Barcode barcode)
    {
        this->barcode = barcode;
    }

private:
    ZXing::Barcode barcode;
};
// TODO: ToLum using WebGL
std::vector<ReadResult> read(const unsigned char *imageData, int width, int height)
{
    ZXing::ImageView image(imageData, width, height, ZXing::ImageFormat::RGBA);
    auto options = ZXing::ReaderOptions().setFormats(ZXing::BarcodeFormat::Any);
    auto barcodes = ZXing::ReadBarcodes(image, options);
    std::vector<ReadResult> results(barcodes.size());

    std::transform(barcodes.begin(), barcodes.end(), results.begin(),
                   [](const ZXing::Barcode &barcode)
                   {
                       ReadResult result(barcode);
                       return result;
                   });
    return results;
}
EMSCRIPTEN_BINDINGS(ReadResult)
{
    emscripten::class_<Rect<int>>("Rect")
        .property("x", &Rect<int>::x)
        .property("y", &Rect<int>::y)
        .property("w", &Rect<int>::w)
        .property("h", &Rect<int>::h);

    emscripten::class_<ReadResult>("ReadResult")
        .property("text", &ReadResult::getText, emscripten::return_value_policy::reference())
        .property("format", &ReadResult::getFormat, emscripten::return_value_policy::reference())
        .property("ecLevel", &ReadResult::getECLevel, emscripten::return_value_policy::reference())
        .property("rect", &ReadResult::getRect, emscripten::return_value_policy::reference())
        .property("hasECI", &ReadResult::hasECI);
    emscripten::function("read", &read);
}
#endif