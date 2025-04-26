const { PrismaClient } = require('@prisma/client');
const ffmpeg = require('../utils/ffmpeg');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.upload = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded');

  const { originalname, filename, size, path: filepath } = file;

  // Get video duration using ffmpeg
  try {
    const duration = await ffmpeg.getDuration(filepath);

    // Save video info in the database
    const video = await prisma.video.create({
      data: {
        name: originalname,
        path: filepath,
        duration,
        size,
      },
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).send('Error processing video');
  }
};
  
// Trimming
exports.trim = async (req, res) => {
  const { id } = req.params;
  const { start, end } = req.query;

  const video = await prisma.video.findUnique({ where: { id: +id } });
  if (!video) return res.status(404).send('Video not found');

  const outputPath = `uploads/trimmed-${uuidv4()}.mp4`;

  try {
    await ffmpeg.trim(video.path, start, end, outputPath);

    // Store old trimmed path to delete after update
    const oldTrimmedPath = video.trimmedPath;

    // Update trim info in DB
    await prisma.video.update({
      where: { id: +id },
      data: {
        trimStart: start,
        trimEnd: end,
        trimmedPath: outputPath,
      },
    });

    // After successful update, delete old trimmed file if exists
    if (oldTrimmedPath) {
      try {
        await fs.promises.unlink(path.resolve(oldTrimmedPath));
        console.log(`Deleted old trimmed video: ${oldTrimmedPath}`);
      } catch (err) {
        console.error(`Failed to delete old trimmed video: ${oldTrimmedPath}`, err.message);
      }
    }

    res.json({ message: 'Trimmed video created', path: outputPath });
    
  } catch (err) {
    console.error('Trimming error:', err.message);
    res.status(500).json({ error: 'Failed to trim video' });
  }
};
  
exports.addSubtitles = async (req, res) => {  
  const { id } = req.params;
  const { subtitles } = req.body; // expecting array [{ text, start, end }, ...]
  try {
    const video = await prisma.video.findUnique({ where: { id: +id } });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    if (!Array.isArray(subtitles) || subtitles.length === 0) {
      return res.status(400).json({ error: 'Subtitles array is required' });
    }

    const outputPath = `uploads/subtitled-${uuidv4()}.mp4`;
    await ffmpeg.addMultipleSubtitles(video.path, subtitles, outputPath);

    // Store old subtitle path to delete after update
    const oldSubtitlePath = video.subtitlePath;

    // Update video: store new subtitle file path and subtitles JSON
    await prisma.video.update({
      where: { id: +id },
      data: {
        subtitlePath: outputPath,
        subtitles: subtitles,
      },
    });

    // After successful update, delete old subtitle file if exists
    if (oldSubtitlePath) {
      try {
        await fs.promises.unlink(path.resolve(oldSubtitlePath));
        console.log(`Deleted old subtitle video: ${oldSubtitlePath}`);
      } catch (err) {
        console.error(`Failed to delete old subtitle video: ${oldSubtitlePath}`, err.message);
      }
    }

    res.json({ message: 'Subtitles added successfully', subtitlePath: outputPath });

  } catch (err) {
    console.error('Add subtitles error:', err.message);
    res.status(500).json({ error: 'Failed to add subtitles' });
  }
};
  
exports.render = async (req, res) => {
  const { id } = req.params;
  const video = await prisma.video.findUnique({ where: { id: +id } });
  if (!video) return res.status(404).send('Video not found');

  try {
    const outputPath = `uploads/rendered-${uuidv4()}.mp4`;
    let workingPath = video.path;
    const oldRenderedPath = video.renderedPath; // store old rendered path
    const oldTrimmedPath = video.trimmedPath;
    const oldSubtitlePath = video.subtitlePath;

    // Only call Render if trimming or subtitles exist
    if (
      (video.trimStart && video.trimEnd) ||
      (video.subtitles && Array.isArray(video.subtitles) && video.subtitles.length > 0)
    ) {
      await ffmpeg.Render(
        workingPath,
        video.trimStart || '00:00:00', // default start if not trimming
        video.trimEnd || video.duration, // default end if not trimming
        video.subtitles || [],
        outputPath
      );
      workingPath = outputPath;
    }

    // Update renderedPath in database
    await prisma.video.update({
      where: { id: +id },
      data: {
        renderedPath: workingPath,
        subtitlePath: null,
        trimmedPath: null
      },
    });

    const pathsToDelete = [oldRenderedPath, oldTrimmedPath, oldSubtitlePath];

    for (const filePath of pathsToDelete) {
      if (filePath) {
        try {
          const resolvedPath = path.resolve(filePath);
          // Check if file actually exists before trying to delete
          await fs.promises.access(resolvedPath, fs.constants.F_OK);
          await fs.promises.unlink(resolvedPath);
          console.log(`Deleted old file: ${filePath}`);
        } catch (err) {
          if (err.code !== 'ENOENT') { // ENOENT = file does not exist, safe to ignore
            console.error(`Failed to delete old file: ${filePath}`, err.message);
          }
        }
      }
    }

    res.json({ message: 'Rendered video created', path: workingPath });

  } catch (err) {
    console.error('Render error:', err.message);
    res.status(500).json({ error: 'Failed to render video' });
  }
};
  

// Download
exports.download = async (req, res) => {
  const { id } = req.params;

  const video = await prisma.video.findUnique({ where: { id: +id } });
  if (!video) return res.status(404).send('Video not found');

  if (!video.renderedPath || !fs.existsSync(video.renderedPath)) {
    return res.status(404).send('Rendered video not found');
  }

  res.download(path.resolve(video.renderedPath), (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
};
