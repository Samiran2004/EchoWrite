import * as tf from '@tensorflow/tfjs-node';
import nsfw from 'nsfwjs';
import fs from 'fs';

async function detectNSFW(imagePath) {
    const model = await nsfw.load();
    const imageBuffer = fs.readFileSync(imagePath);
    const image = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.classify(image);
    image.dispose();

    console.log(predictions);

    const nsfwClasses = ['Porn', 'Sexy', 'Hentai'];
    const isExplicit = predictions.some(
        (pred) => nsfwClasses.includes(pred.className) && pred.probability > 0.6
    );

    return isExplicit
        ? { isSafe: false, reason: 'Explicit content detected' }
        : { isSafe: true };
}

export default detectNSFW;