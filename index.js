const m3u8Parser = require('m3u8-parser')
const request = require('request')
const requestSync = require('sync-request')
const fs = require('fs')

let parser = new m3u8Parser.Parser();


let m3u8_url = 'https://f1.media.brightcove.com/2/2985902027001/5760170331001/2985902027001_5760170331001_5760147655001.m3u8'


let base_url = m3u8_url.substr(0, m3u8_url.lastIndexOf("/") + 1);
let video = fs.createWriteStream('video.ts')

request.get(m3u8_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      
        let manifest = body;
        parser.push(manifest);
        parser.end();

        let parsedManifest = parser.manifest;
        let segments  = parsedManifest.segments
        console.log("Total Segements are " + segments.length)
        segments.forEach(async (segment, index) => {
          let segment_url = base_url+segment.uri
          console.log("** Downloading segment " + (index+1))
          let res = requestSync('GET', segment_url)
          fs.appendFileSync(video.path, res.getBody());
        })
        console.log("Done")
    }
});



