const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const archiver = require('archiver');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/download', protect, async (req, res) => {
    const { url, resolution, format, effects, brightness, contrast, saturation, imageCount } = req.body;

    try {
        const fetchImage = async () => {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            let image = sharp(response.data);

            const [width, height] = resolution.split('x').map(Number);

            // Resize the image while maintaining aspect ratio
            image = image.resize(width, height, {
                fit: sharp.fit.inside,
                withoutEnlargement: false,
            });

            // Apply effects before converting to buffer
            if (effects && effects.length > 0) {
                for (const effect of effects) {
                    if (effect === 'grayscale') {
                        image = image.grayscale();
                    } else if (effect === 'blur') {
                        image = image.blur(10);
                    } else if (effect === 'rotate') {
                        image = image.rotate(90);
                    } else if (effect === 'invert') {
                        image = image.negate();
                    } else if (effect === 'sepia') {
                        image = image.tint({ r: 112, g: 66, b: 20 });
                    }
                }
            }

            // Apply additional adjustments
            if (brightness !== 100) {
                image = image.modulate({ brightness: brightness / 100 });
            }
            if (contrast !== 100) {
                image = image.linear(contrast / 100, -(128 * (contrast / 100 - 1)));
            }
            if (saturation !== 100) {
                image = image.modulate({ saturation: saturation / 100 });
            }

            const resizedImage = await image.toBuffer();

            const resizedMetadata = await sharp(resizedImage).metadata();

            // Calculate offsets to center the image on the canvas
            const left = Math.floor((width - resizedMetadata.width) / 2);
            const top = Math.floor((height - resizedMetadata.height) / 2);

            // Create a white background canvas
            let canvas = sharp({
                create: {
                    width: width,
                    height: height,
                    channels: 3,
                    background: { r: 255, g: 255, b: 255 } // white background
                }
            });

            // Composite the resized image onto the white canvas
            canvas = canvas.composite([{ input: resizedImage, left, top }]);

            if (format === 'jpg') {
                canvas = canvas.jpeg({ quality: 95, chromaSubsampling: '4:4:4' });
            } else if (format === 'png') {
                canvas = canvas.png({ compressionLevel: 0 });
            } else if (format === 'webp') {
                canvas = canvas.webp({ quality: 95 });
            }

            return await canvas.toBuffer();
        };

        if (imageCount > 1) {
            const archive = archiver('zip', { zlib: { level: 9 } });
            res.attachment('images.zip');

            archive.pipe(res);

            for (let i = 1; i <= imageCount; i++) {
                const imageBuffer = await fetchImage();
                archive.append(imageBuffer, { name: `character_${i}.${format}` });
            }

            await archive.finalize();

        } else {
            const imageBuffer = await fetchImage();
            res.set({
                'Content-Type': `image/${format}`,
                'Content-Disposition': `attachment; filename="character.${format}"`,
            });

            res.send(imageBuffer);
        }
    } catch (error) {
        console.error('Error downloading image:', error.message);
        res.status(500).json({ message: 'Failed to download image(s). Please try again later.' });
    }
});

module.exports = router;
