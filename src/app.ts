import helmet from 'helmet';
import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import errorMiddleware from "@/lib/middlewares/error.middleware";
import router from './routes';
const app: Express = express();

app.use(cors(
    {
        credentials: true
    }
))

// Middleware
app.use(helmet()); // Security headers
app.use(cookieParser())
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use("/app",router)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorMiddleware);



export default app;