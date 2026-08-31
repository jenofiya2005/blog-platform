const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Health Check (http://localhost:5000/api/health)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Blog Platform API is running smoothly!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      posts: '/api/posts',
      categories: '/api/categories',
      comments: '/api/posts/:id/comments'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);
app.use('/api/categories', categoryRoutes);

// Serve Frontend Static Files in Production (Single URL Deployment)
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // Friendly Root Route in standalone backend mode
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>BlogSphere REST API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; background: #f8fafc; color: #1e293b; }
          .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
          h1 { color: #4f46e5; margin-top: 0; }
          .badge { background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-weight: 600; font-size: 12px; }
          ul { padding-left: 20px; }
          li { margin: 8px 0; }
          a { color: #4f46e5; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
          .btn { display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 600; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 BlogSphere REST API Server</h1>
          <p><span class="badge">● Server Active & Online</span> &nbsp; Running on <strong>port ${PORT}</strong></p>
          <h3>Quick API Links:</h3>
          <ul>
            <li><a href="/api/health" target="_blank">GET /api/health</a> - API Status Health Check</li>
            <li><a href="/api/posts" target="_blank">GET /api/posts</a> - List all published articles</li>
            <li><a href="/api/categories" target="_blank">GET /api/categories</a> - List all categories</li>
          </ul>
          <h3>Frontend Web App:</h3>
          <a href="http://localhost:5173" class="btn" target="_blank">Open Frontend Web App &rarr;</a>
        </div>
      </body>
      </html>
    `);
  });
}

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Blog Server running on port ${PORT}`);
});