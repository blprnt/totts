/*

Image scraper for random images from ImageNet

Base URL: 
https://machinist.smokingheaps.net/api/datasets/4/files/10827443
*/

const download = require('image-downloader');
var request = require('request');
var fs = require('fs'),
    obj

let baseURL = "https://machinist.smokingheaps.net/api/datasets/4/files/";
let indexStart = 2932966;
let indexEnd = 16086465;


function getPhotosRandom(_num, _flag) {
    for (let i = 0; i < _num; i++) {
        let ii = indexStart + Math.floor(Math.random() * (indexEnd - indexStart));
        console.log(baseURL + ii + ".jpg");
        download.image({
                url:baseURL + ii,
                dest: "../../../images/imagenet" + _flag + "/" + i + ".jpg"
            })
              .then(({ filename }) => {
                console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
              })
              .catch((err) => console.error(err));
    }
}

function getPhotosSeq(_num, _flag, _shift) {
    let start = indexStart + parseInt(Math.random() * (indexEnd - indexStart));
    let dir = "/Users/jerthorp/code/datasets/imagenet" + _flag + "_" + start + "_" + _shift;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    for (let i = 0; i < _num; i++) {
        let ii = start + i;
        download.image({
                url:baseURL + ii,
                dest: dir + "/" + ii + ".jpg"
            })
              .then(({ filename }) => {
                console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
              })
              .catch((err) => console.error(err));
    

    if (Math.random() < _shift) start = indexStart + parseInt(Math.random() * (indexEnd - indexStart));
    }
}

getPhotosSeq(200, "noshift", 0.05);