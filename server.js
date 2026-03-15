import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cloud Run sets PORT environment variable, default to 8080
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', port: PORT });
});

// Handle SPA routing - return index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server with explicit host binding
app.listen(PORT, HOST, () => {
  console.log(`✅ Server started on ${HOST}:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'dist')}`);
  console.log(`🏥 Health endpoint: http://${HOST}:${PORT}/health`);
});
