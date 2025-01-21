require('dotenv').config();

const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3001;

const isDevelopment = process.env.NODE_ENV !== 'production';

const allowedOrigins = isDevelopment
  ? ['http://localhost:3000','http://localhost:3001','any domain here']
#do not forget to change any domain here
  : ['any domain here'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || isDevelopment) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/generateImage', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    res.status(500).json({ error: `Failed to launch the browser process! ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Puppeteer server is running on port ${PORT}`);
});





