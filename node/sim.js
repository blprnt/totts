const fs = require('fs');
const path = require('path');
const { ssim } = require('ssim.js');

const directoryPath = '../../datasets/imagenetNurseFishTrans/';
const outputPath = '../../datasets/imagenetNurseFishTransPairs/';

// Read the images from the directory
const files = fs.readdirSync(directoryPath);
const images = files.filter(file => ['.jpg', '.jpeg', '.png'].includes(path.extname(file)))
                    .map(file => path.join(directoryPath, file));

// Calculate the similarity scores for all pairs of images
let pairs = [];
for (let i = 0; i < images.length; i++) {
  for (let j = i + 1; j < images.length; j++) {
    ssim(images[i], images[j]).then(score => {
      pairs.push({ pair: [images[i], images[j]], score });
    });
  }
}

// Wait for all the similarity scores to be calculated
Promise.all(pairs.map(pair => pair.score)).then(() => {
  // Sort the pairs by their similarity score
  pairs.sort((a, b) => b.score - a.score);

  // Save the most similar pairs to the output directory
  for (let i = 0; i < Math.min(10, pairs.length); i++) { // Save only the top 10 most similar pairs
    const pair = pairs[i].pair;
    const newNames = pair.map(file => path.basename(file, path.extname(file)) + '-' + i + path.extname(file));
    fs.copyFileSync(pair[0], path.join(outputPath, newNames[0]));
    fs.copyFileSync(pair[1], path.join(outputPath, newNames[1]));
  }
}).catch(err => console.error(err));