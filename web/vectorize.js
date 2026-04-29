const Jimp = require('jimp');
const potrace = require('potrace');
const fs = require('fs');

async function processLogo() {
    const imagePath = 'e:/projetos/grupoportilho/inspirations/imagens_instagram/468736305_122185852028235790_6005228855997167652_n.jpg';
    const img = await Jimp.read(imagePath);

    const blueMask = img.clone();
    const greenMask = img.clone();

    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    const updateBounds = (x, y) => {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    };

    blueMask.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        const isBg = r > 200 && g > 200 && b > 200;
        const isGreen = !isBg && (g > b + 20) && (g > r - 20);
        const isBlue = !isBg && !isGreen;

        if (isBlue) {
            updateBounds(x, y);
            this.bitmap.data[idx] = 0;
            this.bitmap.data[idx + 1] = 0;
            this.bitmap.data[idx + 2] = 0;
        } else {
            this.bitmap.data[idx] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
        }
    });

    greenMask.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        const isBg = r > 200 && g > 200 && b > 200;
        const isGreen = !isBg && (g > b + 20) && (g > r - 20);

        if (isGreen) {
            updateBounds(x, y);
            this.bitmap.data[idx] = 0;
            this.bitmap.data[idx + 1] = 0;
            this.bitmap.data[idx + 2] = 0;
        } else {
            this.bitmap.data[idx] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
        }
    });

    const traceParams = {
        color: '#031d38',
        threshold: 128,
        optCurve: true,
        optTolerance: 0.2 // Reduced tolerance for HIGHER fidelity curve hugging
    };

    const getSvg = (jimpImg, color) => new Promise((resolve, reject) => {
        jimpImg.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) return reject(err);
            const params = { ...traceParams, color };
            potrace.trace(buffer, params, (err, svg) => {
                if (err) return reject(err);
                resolve(svg);
            });
        });
    });

    const svgBlue = await getSvg(blueMask, '#002d79');
    const svgGreen = await getSvg(greenMask, '#a3e635');

    const getPaths = (svg) => {
        return svg.replace(/<\/?svg[^>]*>/g, '').replace(/<\?xml.*?\?>/g, '').replace(/<!DOCTYPE.*?>/g, '');
    };

    const bluePaths = getPaths(svgBlue);
    const greenPaths = getPaths(svgGreen);

    // Dynamic width and height of the pure logo without white bounds
    const boxW = maxX - minX;
    const boxH = maxY - minY;

    const finalSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${boxW}" height="${boxH}" viewBox="${minX} ${minY} ${boxW} ${boxH}" preserveAspectRatio="xMidYMid meet">
  ${bluePaths}
  ${greenPaths}
</svg>`;

    fs.writeFileSync('e:/projetos/grupoportilho/web/public/assets/img/logo_completa_traced.svg', finalSvg);
    console.log("Vectorized High-Res logo successfully with dynamic bounding boxes.");
}

processLogo().catch(console.error);
