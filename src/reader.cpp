#include <string>
#include <vector>
#include <algorithm>
#include <type_traits>
#include "ReadBarcode.h"
#include <emscripten/bind.h>

const emscripten::val parseXYPoint(ZXing::PointI point)
{
    emscripten::val jsArray = emscripten::val::array();
    jsArray.set(0, point.x);
    jsArray.set(1, point.y);
    return jsArray;
};
const emscripten::val getBarcodeRect(ZXing::Barcode barcode)
{
    emscripten::val jsArray = emscripten::val::array();
    auto pos = barcode.position();
    jsArray.set(0, parseXYPoint(pos.topLeft()));
    jsArray.set(1, parseXYPoint(pos.topRight()));
    jsArray.set(2, parseXYPoint(pos.bottomRight()));
    jsArray.set(3, parseXYPoint(pos.bottomLeft()));
    return jsArray;
}
const inline std::string getBarcodeFormatDescription(ZXing::Barcode barcode)
{
    return ZXing::ToString(barcode.format());
}
const inline std::string getBarcodeText(ZXing::Barcode barcode)
{
    return barcode.text();
}

class Reader
{
public:
    int width;
    int height;
    Reader()
    {
        width = 0;
        height = 0;
        options = ZXing::ReaderOptions().setFormats(ZXing::BarcodeFormat::Any);
    }
    Reader(int width, int height)
    {
        resizeBuf(width, height);
        options = ZXing::ReaderOptions().setFormats(ZXing::BarcodeFormat::Any);
    }
    emscripten::val getBuf()
    {
        return emscripten::val(emscripten::typed_memory_view(_buf.size(), _buf.data()));
    };
    ZXing::Barcodes read()
    {
        ZXing::ImageView image(_buf.data(), width, height, format);
        return ZXing::ReadBarcodes(image, options);
    }
    void resizeBuf(int width, int height)
    {
        this->width = width;
        this->height = height;
        _buf.resize(width * height * channel);
    }
    void setChannel(int channel)
    {
        if (channel == 4)
        {
            format = ZXing::ImageFormat::RGBA;
        }
        else if (channel == 1)
        {
            format = ZXing::ImageFormat::Lum;
        }
        else
        {
            throw std::invalid_argument("only support RGBA or Lum");
        }
        this->channel = channel;
    }

private:
    std::vector<unsigned char> _buf;
    ZXing::ReaderOptions options;
    int channel = 1;
    ZXing::ImageFormat format = ZXing::ImageFormat::Lum;
};

EMSCRIPTEN_BINDINGS(ZxingReader)
{
    using namespace emscripten;
    register_vector<ZXing::Barcode>("Barcodes");

    class_<ZXing::Barcode>("Barcode")
        .property("ecLevel", &ZXing::Barcode::ecLevel)
        .property("hasECI", &ZXing::Barcode::hasECI);

    function("getBarcodeFormatDescription", &getBarcodeFormatDescription);
    function("getBarcodeRect", &getBarcodeRect);
    function("getBarcodeText", &getBarcodeText);
    class_<Reader>("Reader")
        .constructor<>()
        .constructor<int, int>()
        .property("width", &Reader::width)
        .property("height", &Reader::height)
        .function("resizeBuf", &Reader::resizeBuf)
        .function("read", &Reader::read)
        .function("getBuf", &Reader::getBuf) // 将 property 改为 function
        .function("setChannel", &Reader::setChannel);
}
