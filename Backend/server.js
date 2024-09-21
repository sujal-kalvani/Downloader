const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const cors =require('cors')
const ytdl = require('ytdl-core');
const { spawn } = require('child_process');
const fs = require('fs');
const { exec } = require("yt-dlp-exec");
const ffmpeg = require('fluent-ffmpeg');
// const axios = require('axios');
// const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

app.use(express.json());
app.use(cors());

// ==================================== YOUTUBE SERVER CODE ===========================================

const getResu = (formats) => {
  let resuArray = [];
  for (let i = 0; i < formats.length; i++) {
    if (formats[i].qualityLabel !== null) {
      resuArray.push(formats[i]);
    }
  }
  return [...new Set(resuArray.map(v => v.height))];
};

app.get('/api/get-video-info/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { videoDetails, formats } = await ytdl.getInfo(id);
    const { title, thumbnails, lengthSeconds } = videoDetails;
    const videoResu = getResu(formats);

    return res.status(200).json({
      videoInfo: {
        title,
        thumbnailUrl: thumbnails[thumbnails.length - 1].url,
        duration: lengthSeconds,
        videoResu,
        lastResu: videoResu[0]
      }
    });
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ error: 'Failed to get video info' });
  }
});

app.get('/api/video-download2', async (req, res) => {
  const videoURL = req.query.url;
  const quality = req.query.quality;

  console.log(`Downloading video from URL: ${videoURL} with quality: ${quality}`);

  const ytDlpPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\yt-dlp.exe';
  const tempDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  try {
    // Get video info to retrieve the title
    const { videoDetails } = await ytdl.getInfo(videoURL);
    const videoTitle = videoDetails.title.replace(/[<>:"\/\\|?*]+/g, ''); // Clean up invalid characters

    const videoFilePath = path.join(tempDir, `${videoTitle}_video.mp4`);
    const audioFilePath = path.join(tempDir, `${videoTitle}_audio.mp4`);
    const mergedFilePath = path.join(tempDir, `${videoTitle}_merged.mp4`);

    // Download video
    const videoArgs = [
      '-f', `bestvideo[height<=${quality}]`,
      '-o', videoFilePath,
      videoURL
    ];
    const videoProcess = spawn(ytDlpPath, videoArgs);

    videoProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Video download process exited with code ${code}`);
        return res.status(500).send('Error downloading video');
      }

      // Download audio
      const audioArgs = [
        '-f', 'bestaudio',
        '-o', audioFilePath,
        videoURL
      ];
      const audioProcess = spawn(ytDlpPath, audioArgs);

      audioProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Audio download process exited with code ${code}`);
          return res.status(500).send('Error downloading audio');
        }

        // Merge audio and video
        ffmpeg()
          .input(videoFilePath)
          .input(audioFilePath)
          .audioCodec('aac')
          .videoCodec('copy')
          .output(mergedFilePath)
          .on('end', () => {
            console.log('Downloaded and merged successfully');
            // Serve the merged file
            res.download(mergedFilePath, `${videoTitle}.mp4`, (err) => {
              if (err) {
                console.error(`Error sending file: ${err}`);
              }
              // Clean up
              fs.unlink(videoFilePath, (err) => {
                if (err) console.error(`Error deleting video file: ${err}`);
              });
              fs.unlink(audioFilePath, (err) => {
                if (err) console.error(`Error deleting audio file: ${err}`);
              });
              fs.unlink(mergedFilePath, (err) => {
                if (err) console.error(`Error deleting merged file: ${err}`);
              });
            });
          })
          .on('error', (err) => {
            console.error(`FFmpeg error: ${err.message}`);
            res.status(500).send('Error processing video download');
          })
          .run();
      });
    });

    videoProcess.on('error', (err) => {
      console.error(`Video download process error: ${err.message}`);
      res.status(500).send('Error processing video download');
    });
  } catch (error) {
    console.error('Error fetching video info or during download:', error);
    res.status(500).send('Failed to process video');
  }
});

// =================================== INSTAGRAM SERVER =====================================================
app.post('/api/download', async (req, res) => {  
  const { url } = req.body;  

  try {  
    const browser = await puppeteer.launch({ headless: true });  
    const page = await browser.newPage();  
    await page.goto(url, { waitUntil: 'domcontentloaded' });  

    // Wait for the loader to disappear  
    await page.waitForFunction(() => {  
      const loader = document.querySelector('.loader'); // Change this to the actual loader class  
      return !loader || loader.style.display === 'none';  
    });  

    const data = await page.evaluate(() => {  
      const videoElement = document.querySelector('video');  
      const imageElement = document.querySelector('meta[property="og:image"]');  
      
      return {  
        thumbnail_url: imageElement?.content || null,  
        media_url: videoElement ? videoElement.src : imageElement?.content,  
        title: document.querySelector('meta[property="og:title"]')?.content,  
      };  
    });  

    await browser.close();  
    
    if (!data.media_url) {  
      return res.status(500).json({ error: 'Failed to extract media URL.' });  
    }  

    console.log('Fetched Instagram post data:', data);  
    res.json(data);  
  } catch (error) {  
    console.error('Error fetching Instagram post:', error);  
    res.status(500).json({ error: 'Failed to fetch data from Instagram.' });  
  }  
});
// ===================================== FACEBOOK SERVER =================================================

app.post("/api/fb-video-info", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    // Fetch video details using yt-dlp
    const result = await exec(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      format: "best",
    });

    const videoInfo = JSON.parse(result.stdout);
    const { title, thumbnail, duration } = videoInfo;
    
    // Sort qualities by resolution

    res.json({
      title,
      thumbnail,
      duration,
    });
  } catch (error) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.post("/api/fb-download", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const outputFileName = path.join(__dirname, "video.mp4");

  try {
    // Downloading video using yt-dlp
    await exec(url, {
      output: outputFileName,
      format: "best",
    });

    // Send the video file to the client
    res.download(outputFileName, (err) => {
      if (err) {
        res.status(500).send("Error downloading video");
      }

      // Clean up the downloaded file after sending
      fs.unlinkSync(outputFileName);
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to download video" });
  }
});

// ==================================== X SERVER CODE ================================================
// Function to format file sizes in a readable way
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return "Unknown size";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Endpoint to fetch video details
app.post("/api/x-video-info", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    // Fetch video details using yt-dlp
    const result = await exec(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      format: "best",
    });

    const videoInfo = JSON.parse(result.stdout);
    const { title, thumbnail, duration, formats } = videoInfo;

    // Filter and format available qualities
    const qualities = formats
      .filter(
        (format) =>
          format.ext === "mp4" && // Only MP4 formats
          format.vcodec !== "none" && // Exclude video-only formats
          format.acodec !== "none" // Exclude audio-only formats
      )
      .map((format) => ({
        quality: format.format_id,
        resolution: format.height ? `${format.height}p` : format.format_note, // Use height if available, else fallback to format note
        size: format.filesize ? formatBytes(format.filesize) : "Unknown size", // Convert size to a readable format
      }));

    // Sort qualities by resolution
    qualities.sort((a, b) => {
      const resA = parseInt(a.resolution);
      const resB = parseInt(b.resolution);
      return resB - resA; // Sort descending
    });

    res.json({
      title,
      thumbnail,
      duration,
      qualities,
    });
  } catch (error) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.post("/api/x-download", async (req, res) => {
  const { url, quality } = req.body;
  const outputFileName = path.join(__dirname, "video.mp4");

  if (!url || !quality) {
    return res.status(400).json({ error: "URL or quality not provided" });
  }

  try {
    // Downloading video in selected quality using yt-dlp
    await exec(url, {
      format: quality,
      output: outputFileName,
    });

    // Send the video file to the client
    res.download(outputFileName, (err) => {
      if (err) {
        res.status(500).send("Error downloading video");
      }

      // Clean up the downloaded file after sending
      fs.unlinkSync(outputFileName);
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to download video" });
  }
});   

app.get('/', (req, res) => {
  res.send('Start');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
