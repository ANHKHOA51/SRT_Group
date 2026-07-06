import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db, { initializeDatabase } from './db.js';
import tasksRouter from './routes/tasks.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

app.get('/api/health', async (req, res) => {
  try {
    const dbCheck = await db.raw('SELECT NOW()');
    res.json({
      status: 'healthy',
      serverTime: new Date(),
      databaseConnected: true,
      dbTime: dbCheck.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      databaseConnected: false,
      error: error.message,
    });
  }
});

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running successfully on http://localhost:${port}`);
  });
});
