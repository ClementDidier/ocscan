const jimp = require('jimp');

class PictureAnalyser
{
    getSimilarityRate(img1, img2, callback)
    {
      jimp.read(img1, function (err, image1) {
        jimp.read(img2, function (err, image2) {
          callback(jimp.distance(image1, image2));
        });
      });
    }
}

module.exports = PictureAnalyser;
