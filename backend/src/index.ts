import express from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import availabilityRoutes from './routes/availability.js';
import scheduleRoutes from './routes/schedule.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// TODO: app.use(cors()) — needed for frontend on a different port

// General API rate limiter — 100 requests per minute per IP
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later' },
  }),
);

// Routes
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/availability', availabilityRoutes);
app.use('/schedule', scheduleRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
