const fs = require('fs');
const async = require('async');
const srt = require('srt-to-text');

const dir = '/projects/data/videos';
const files = fs.readdirSync(dir);

const exec = require('child_process').exec;
const ffmpegDir = '/usr/bin/ffmpeg';

files.map(
  function(ytId) {
    const source = dir + '/' + ytId + '/' + ytId + '.en.vtt';
    const destination = dir + '/' + ytId + '/subtitles.json';
    const data = {};
    data.subtitles = null;

    if (fs.existsSync(destination)) {
      return;
    }

    if (fs.existsSync(source)) {
      const vtt = fs.readFileSync(source, 'utf-8');
      data.subtitles = srt.parse(vtt);
    }

    fs.writeFileSync(destination, JSON.stringify(data, null, 2));
  }
);
