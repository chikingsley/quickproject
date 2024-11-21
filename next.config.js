/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    serverActions: {
      enabled: true
    }
  }
}

// Enable HTTPS in development
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Create the secure HTTPS server only in development
if (dev) {
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './certs/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, './certs/localhost.crt')),
  };

  app.prepare().then(() => {
    createServer(httpsOptions, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://${hostname}:${port}`);
    });
  });
}

module.exports = nextConfig
