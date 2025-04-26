const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const upload = require('../utils/upload');

/**
 * @swagger
 * /api/videos/upload:
 *   post:
 *     summary: Upload a video file
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 */
router.post('/upload', upload.single('video'), videoController.upload);

/**
 * @swagger
 * /api/videos/{id}/trim:
 *   post:
 *     summary: Trim a video
 *     description: Trim the video between the specified start and end timestamps
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the video to trim
 *         schema:
 *           type: integer
 *       - in: query
 *         name: start
 *         required: true
 *         description: The start timestamp for trimming
 *         schema:
 *           type: string
 *       - in: query
 *         name: end
 *         required: true
 *         description: The end timestamp for trimming
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video successfully trimmed
 */
router.post('/:id/trim', videoController.trim);

/**
 * @swagger
 * /api/videos/{id}/subtitles:
 * paths:
 *   /api/videos/{id}/subtitles:
 *     post:
 *       summary: Add subtitles to a video
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Video ID
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subtitles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       start_time:
 *                         type: string
 *                       end_time:
 *                         type: string
 *             example:
 *               subtitles:
 *                 - text: "hello"
 *                   start_time: "00:00:00"
 *                   end_time: "00:00:01"
 *                 - text: "world"
 *                   start_time: "00:00:01"
 *                   end_time: "00:00:02"
 *       responses:
 *         '200':
 *           description: Successfully added subtitles
 *         '400':
 *           description: Invalid request
 *         '500':
 *           description: Internal server error
 */
router.post('/:id/subtitles', videoController.addSubtitles);

/**
 * @swagger
 * /api/videos/{id}/render:
 *   post:
 *     summary: Render a video with all applied changes
 *     description: Combines all the changes (e.g., trimming, subtitles) and renders the final video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the video to render
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video rendering has started
 *       500:
 *         description: Error occurred while rendering the video
 */
router.post('/:id/render', videoController.render);

/**
 * @swagger
 * /api/videos/{id}/download:
 *   get:
 *     summary: Download the final rendered video
 *     description: Download the video after all changes have been applied
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the video to download
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The video file for download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Video not found
 */
router.get('/:id/download', videoController.download);

module.exports = router;
