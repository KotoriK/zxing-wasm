@group(0) @binding(0) var video : texture_external;
@group(0) @binding(1) var<storage, read_write> outputPixels : array<u32>;

@compute @workgroup_size(16, 1)
fn main(@builtin(global_invocation_id) global_id : vec3 < u32>)
{
    let dimensions = textureDimensions(video);
    let base_x = global_id.x * 4u;//计算基础x坐标
    let base_y = global_id.y;//计算基础y坐标

    //处理2x2像素块
    var result : u32 = 0u;
    for(var dx = 0u; dx < 4u; dx++)
    {
        var x = dx + base_x;
        var y = base_y;
        if(x > dimensions.x)
        {
            x = x - dimensions.x;
            y = y + 1;
        }
        let rgba = textureLoad(video, vec2 < u32 > (x, y));
        let lum = rgba.r * 0.299 + rgba.g * 0.587 + rgba.b * 0.114;

        result = result | ((u32(lum * 255) & 0xFFu) << (8u * dx));
    }
    outputPixels[(base_y * dimensions.x + base_x) / 4u] = result;
}
