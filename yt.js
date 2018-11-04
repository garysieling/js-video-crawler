const fs = require('fs');
const async = require('async');

const dir = '/home/gary/Desktop/findlectures/json/1/';
const files = fs.readdirSync(dir);

const exec = require('child_process').exec;
const ffmpegDir = '/usr/bin/ffmpeg';

const start = process.argv[2]
const end = process.argv[3]

//console.log(start);
//console.log(end);

const dataDir = '/projects/data/videos';
const KEY=process.env.YOUTUBE_KEY;

if (!KEY) {
  console.log("Define YOUTUBE_KEY");
  process.exit(1);
}

async.mapSeries(
  files.slice(start, end).map(
    (filename) => {
      const json = JSON.parse(fs.readFileSync(dir + filename));
      const url = json.url_s || json.video_url_s || '';
      if (url.indexOf('youtube') < 0) {
        return null;
      }

      if (url.indexOf('v=') < 0) {
        return null;
      }

      ytId = url.match(/.*v=([^&]*).*/)[1];

      return ytId;
    }  
  ).filter(
    (x) => !!x
  ).filter(
    (ytId) => 
      fs.existsSync(dataDir + '/' + ytId + '/' + ytId + '.info.json')
      && !fs.existsSync(dataDir + '/' + ytId + '/api.json')
  ),
  function(ytId, cb) {
    console.log(ytId);
/*
`/home/gary/.local/bin/youtube-dl \
      --ffmpeg-location ${ffmpegDir} \
      --skip-download -w \
      --ignore-errors --youtube-skip-dash-manifest \
      --write-info-json \
      --write-auto-sub --write-sub --sub-lang en --sub-format srt  \
      --convert-subs srt \
      --no-call-home \
      "https://www.youtube.com/watch?v=${ytId}"
	`
*/
     const command = `curl -o '${dataDir}/${ytId}/api.json' 'https://www.googleapis.com/youtube/v3/videos?id=${ytId}&key=${KEY}&part=player,statistics,status,topicDetails'`;
     console.log(command);

     exec(command, function callback(error, stdout, stderr){
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
