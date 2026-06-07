import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Vercel serverless entry point
export default async (req, res) => {
  try {
    // Ensure MongoDB is connected
    await connectDB();
    
    // Forward the request to the Express application handler
    return app(req, res);
  } catch (error) {
    console.error('Database connection error in serverless handler:', error);
    res.status(500).json({
      success: false,
      message: 'Serverless database connection failed',
      error: error.message
    });
  }
};
