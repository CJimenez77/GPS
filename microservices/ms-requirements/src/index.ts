import express from 'express';
import empresasRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', empresasRoutes);

app.listen(PORT, () => {
  console.log(`ms-requirements running on port ${PORT}`);
});

export default app;