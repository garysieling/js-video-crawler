const fs = require('fs');
const async = require('async');

const dir = '/home/gary/Desktop/findlectures/json/1/';
const files = fs.readdirSync(dir);

const exec = require('child_process').exec;
const ffmpegDir = '/usr/bin/ffmpeg';

async.mapSeries(
  files,
  function(filename, cb) {
    console.log(filename);

    const json = JSON.parse(fs.readFileSync(dir + filename));
    const url = json.url_s;
    if (url.indexOf('youtube') < 0) {
      return cb();
    }

    if (url.indexOf('v=') < 0) {
      return cb();
    }

    ytId = url.match(/.*v=([^&]*).*/)[1];
    console.log(ytId);

    const dataDir = '/projects/data/videos';

    exec(`/usr/bin/youtube-dl \
      --ffmpeg-location ${ffmpegDir} \
      --skip-download -w \
      --ignore-errors --youtube-skip-dash-manifest \
      -o '${dataDir}/${ytId}/%(id)s' --write-info-json \
      --write-auto-sub --write-sub --sub-lang en --sub-format srt  \
      --convert-subs srt \
      --no-call-home \
      "https://www.youtube.com/watch?v=${ytId}"
	`, function callback(error, stdout, stderr){
      if (error) {
        console.log(error);
      }

      console.log(stdout);
      console.log(stderr);
      cb();
    });
  },
  () => {}
);
