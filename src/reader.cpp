#include <string>
#include <vector>
#include <algorithm>
#include <cmath>
#include <limits>
#include <stdexcept>
#include <type_traits>
#include "BarcodeFormat.h"
#include "ReadBarcode.h"
#include "js-error.h"
#include <emscripten/bind.h>
EMSCRIPTEN_DECLARE_VAL_TYPE(NumberArray);
EMSCRIPTEN_DECLARE_VAL_TYPE(BarcodeFormatsArg);

static bool isKnownBarcodeFormat(ZXing::BarcodeFormat format)
{
    switch (format)
    {
#define ZX_(NAME, SYM, VAR, FLAGS, ZINT, ENABLED, HRI) \
    case ZXing::BarcodeFormat::NAME:                    \
        return true;
        ZX_BCF_LIST(ZX_)
#undef ZX_
    }
    return false;
}

static ZXing::BarcodeFormat parseBarcodeFormatFlag(const emscripten::val &flag)
{
    if (flag.isNull() || flag.isUndefined())
    {
        throwTypeError("BarcodeFormat must be a flag object or array of flag objects");
    }

    const auto value = flag["value"];
    if (!value.isNumber())
    {
        throwTypeError("BarcodeFormat must be a flag object or array of flag objects");
    }

    const auto number = value.as<double>();
    if (!std::isfinite(number) || number < 0 ||
        number > std::numeric_limits<unsigned int>::max() || std::trunc(number) != number)
    {
        throwTypeError("Invalid BarcodeFormat flag value: " + std::to_string(number));
    }

    const auto raw = static_cast<unsigned int>(number);
    const auto format = static_cast<ZXing::BarcodeFormat>(raw);
    if (!isKnownBarcodeFormat(format) || format == ZXing::BarcodeFormat::None)
    {
        throwTypeError("Invalid BarcodeFormat flag value: " + std::to_string(raw));
    }
    return format;
}

static ZXing::BarcodeFormats parseBarcodeFormats(const BarcodeFormatsArg &value)
{
    std::vector<ZXing::BarcodeFormat> values;
    if (value.isArray())
    {
        const auto length = value["length"].as<unsigned int>();
        values.reserve(length);
        for (unsigned int i = 0; i < length; ++i)
        {
            values.push_back(parseBarcodeFormatFlag(value[i]));
        }
    }
    else
    {
        values.push_back(parseBarcodeFormatFlag(value));
    }

    auto formats = ZXing::BarcodeFormats(std::move(values));
    if (formats.empty())
    {
        throwTypeError("BarcodeFormats must contain at least one selectable format flag");
    }
    return formats;
}

static size_t checkedBufferSize(int width, int height, int channel)
{
    if (width < 0 || height < 0)
    {
        throwTypeError("Reader width and height must be non-negative");
    }

    const auto w = static_cast<size_t>(width);
    const auto h = static_cast<size_t>(height);
    const auto c = static_cast<size_t>(channel);
    const auto max = std::numeric_limits<size_t>::max();
    if ((w != 0 && h > max / w) || (w * h != 0 && c > max / (w * h)))
    {
        throwTypeError("Reader buffer dimensions are too large");
    }
    return w * h * c;
}

const NumberArray getBarcodeRect(ZXing::Barcode barcode)
{
    emscripten::val jsArray = emscripten::val::array();
    auto pos = barcode.position();
    jsArray.set(0, pos.topLeft().x);
    jsArray.set(1, pos.topLeft().y);
    jsArray.set(2, pos.topRight().x);
    jsArray.set(3, pos.topRight().y);
    jsArray.set(4, pos.bottomRight().x);
    jsArray.set(5, pos.bottomRight().y);
    jsArray.set(6, pos.bottomLeft().x);
    jsArray.set(7, pos.bottomLeft().y);
    return static_cast<NumberArray>(jsArray);
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
    Reader() : Reader(ZXing::BarcodeFormats(ZXing::BarcodeFormat::All))
    {
    }
    Reader(BarcodeFormatsArg formats) : Reader(parseBarcodeFormats(formats))
    {
    }
    Reader(int width, int height) : Reader(width, height, ZXing::BarcodeFormats(ZXing::BarcodeFormat::All))
    {
    }
    Reader(int width, int height, BarcodeFormatsArg formats) : Reader(width, height, parseBarcodeFormats(formats))
    {
    }
    inline int getWidth() const
    {
        return _width;
    }
    inline int getHeight() const
    {
        return _height;
    }
    inline size_t getBufSize() const
    {
        return _buf.size();
    }
    inline auto getBufOffset() const
    {
        return reinterpret_cast<uintptr_t>(_buf.data());
    }
    ZXing::Barcodes read()
    {
        ZXing::ImageView image(_buf.data(), _width, _height, format);
        return ZXing::ReadBarcodes(image, options);
    }
    void resizeBuf(int width, int height)
    {
        const auto size = checkedBufferSize(width, height, channel);
        _buf.resize(size);
        _width = width;
        _height = height;
    }
    void prepareBuf(int width, int height, int channel, size_t allocationSize)
    {
        const auto minimumSize = checkedBufferSize(width, height, channel);
        if (allocationSize < minimumSize)
        {
            throwTypeError("Reader buffer allocation is smaller than the image data");
        }

        ZXing::ImageFormat nextFormat;
        if (channel == 4)
        {
            nextFormat = ZXing::ImageFormat::RGBA;
        }
        else if (channel == 1)
        {
            nextFormat = ZXing::ImageFormat::Lum;
        }
        else
        {
            throwTypeError("only support RGBA or Lum");
        }

        _buf.resize(allocationSize);
        _width = width;
        _height = height;
        this->channel = channel;
        format = nextFormat;
    }
    void setChannel(int channel)
    {
        prepareBuf(_width, _height, channel, checkedBufferSize(_width, _height, channel));
    }

private:
    Reader(ZXing::BarcodeFormats formats)
        : options(ZXing::ReaderOptions().setFormats(std::move(formats)))
    {
    }
    Reader(int width, int height, ZXing::BarcodeFormats formats) : Reader(std::move(formats))
    {
        resizeBuf(width, height);
    }

    std::vector<unsigned char> _buf;
    ZXing::ReaderOptions options;
    int _width = 0;
    int _height = 0;
    int channel = 1;
    ZXing::ImageFormat format = ZXing::ImageFormat::Lum;
};

EMSCRIPTEN_BINDINGS(ZxingReader)
{
    using namespace emscripten;

    enum_<ZXing::BarcodeFormat>("BarcodeFormat")
#define ZX_(NAME, SYM, VAR, FLAGS, ZINT, ENABLED, HRI) .value(#NAME, ZXing::BarcodeFormat::NAME)
        ZX_BCF_LIST(ZX_)
#undef ZX_
        ;

    register_type<BarcodeFormatsArg>(
        "BarcodeFormats",
        "Exclude<BarcodeFormat, BarcodeFormatFlag<'None', 0>> | "
        "readonly Exclude<BarcodeFormat, BarcodeFormatFlag<'None', 0>>[]");

    register_vector<ZXing::Barcode>("Barcodes");

    class_<ZXing::Barcode>("Barcode")
        .property("format", &ZXing::Barcode::format)
        .property("ecLevel", &ZXing::Barcode::ecLevel)
        .property("hasECI", &ZXing::Barcode::hasECI);

    register_type<NumberArray>("[number,number,number,number,number,number,number,number]" /*vector 8 */);

    function("getBarcodeFormatDescription", &getBarcodeFormatDescription);
    function("getBarcodeRect", &getBarcodeRect);
    function("getBarcodeText", &getBarcodeText);

    class_<Reader>("Reader")
        .constructor<>()
        .constructor<BarcodeFormatsArg>()
        .constructor<int, int>()
        .constructor<int, int, BarcodeFormatsArg>()
        .property("width", &Reader::getWidth)
        .property("height", &Reader::getHeight)
        .function("resizeBuf", &Reader::resizeBuf)
        .function("prepareBuf", &Reader::prepareBuf)
        .function("read", &Reader::read)
        .function("getBufOffset", &Reader::getBufOffset) 
        .function("getBufSize", &Reader::getBufSize)
        .function("setChannel", &Reader::setChannel);
}
