const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.getDuration = (filePath) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration);
      });
    });
  };
  
function timeToSeconds(timeStr) {
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }
  
  exports.trim = (inputPath, start, end, outputPath) => {
    const duration = timeToSeconds(end) - timeToSeconds(start);
  
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(duration)
        .output(outputPath)
        .on('end', () => resolve(true))
        .on('error', (err) => reject(err))
        .run();
    });
  };

  exports.addMultipleSubtitles = async (inputPath, subtitles, outputPath) => {
    return new Promise((resolve, reject) => {
     
      const subtitlesPath = path.join('uploads', `subtitles-${uuidv4()}.srt`);
      const srtContent = generateSrt(subtitles);
  
      fs.writeFileSync(subtitlesPath, srtContent, 'utf8');
  
      ffmpeg(inputPath)
        .outputOptions('-vf', `subtitles='${subtitlesPath.replace(/\\/g, "/")}'`)
        .save(outputPath)
        .on('end', () => {
          // Clean up the temp subtitles file
          fs.unlink(subtitlesPath, () => {});
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg subtitle error:', err.message);
          reject(err);
        });
    });
  };

  exports.Render = async (inputPath, start, end, subtitles, outputPath) => {
    const duration = timeToSeconds(end) - timeToSeconds(start);
  
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);
  
      if (subtitles && subtitles.length > 0) {
        const subtitlesPath = path.join('uploads', `subtitles-${uuidv4()}.srt`);
        const srtContent = generateSrt(subtitles);
        fs.writeFileSync(subtitlesPath, srtContent, 'utf8');
  
        command = command.videoFilter(`subtitles='${subtitlesPath.replace(/\\/g, "/")}'`);
  
        command.on('end', () => {
          fs.unlink(subtitlesPath, () => {}); // Clean subtitle file
        });
      }
  
      command
        .outputOptions([
          `-ss ${start}`,
          `-t ${duration}`
        ])
        .output(outputPath)
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg render error:', err.message);
          reject(err);
        })
        .run();
    });
  };
  

  
  function generateSrt(subtitles) {
    return subtitles.map((sub, index) => {
      const start = formatTime(sub.start_time);
      const end = formatTime(sub.end_time);
      return `${index + 1}\n${start} --> ${end}\n${sub.text}\n`;
    }).join('\n\n');
  }
  
  function formatTime(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const date = new Date(0);
    date.setSeconds(totalSeconds);
    const milliseconds = 0; // Set milliseconds to 0
    return `${date.toISOString().substr(11, 8)},${milliseconds.toString().padStart(3, '0')}`;
  }
  