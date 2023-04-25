const { createCanvas, loadImage } = require('canvas')
const compareImages = require("resemblejs/compareImages");
const path = require('path');
const fs = require('fs');
const cliProgress = require('cli-progress');

//Progress bar
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

let _outDir = "../images/imagenet/"


let best = 0;
let bestID;
let mc = 0;

function matchHandler(_data, _file, _count) {
  mc++;
  if (_data.rawMisMatchPercentage > best) {
    best = _data.rawMisMatchPercentage;
    bestID = _file;
  }
  if (mc == _count) {
    console.log(bestID);
  }
} 

async function getMatches(_seedURL, _matchDir, _num) {

  
  let fileList = fs.readdirSync(_matchDir);

    let options = {};

    // Create an array of promises for each image comparison
    const promises = fileList
      .filter(file => file !== _seedURL) // exclude the seed image from comparisons
      .map(async file => {
        
        const data = await compareImages(await fs.promises.readFile(path.join(_matchDir, _seedURL)), await fs.promises.readFile(path.join(_matchDir, file)), options);
        return { data, file };
      });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    results.sort((b,a) => a.data.misMatchPercentage - b.data.misMatchPercentage);

    return(results[0])


    


}

async function makeMatchSet(_matchDir, _num) {
  
  //Set up the JSON
  let j = {type:"pairs", birds:[]};
  //Get the file list
  let fileList = fs.readdirSync(_matchDir);
  let seed;

  bar1.start(fileList.length / 2, 0);  
  //Do the matchy-match
  for (let i = 0; i < _num; i+= 2) {
      bar1.increment();
      let pick = Math.floor(Math.random() * fileList.length);
      seed = fileList[pick];
      j.birds.push({"type":"imageNet", "img":seed});
      fs.copyFileSync(_matchDir + seed, _outDir + seed);
      let match = await getMatches(seed, _matchDir, 1);
      j.birds.push({"type":"imageNet", "img":match.file});
      fs.copyFileSync(_matchDir + match.file, _outDir + match.file);
      console.log(match.file + ":" + seed); 
  }

  bar1.stop();

  console.log("pre-write");

  //Write the json
  let json = JSON.stringify(j);
  fs.writeFile('../../totts/sets/pairs_' + seed.split(".")[0] + '.json', json, function() {

  });
}

makeMatchSet("../../datasets/imagenetNurseFishTrans/", 50);
