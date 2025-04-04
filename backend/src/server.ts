import app from './app';
import 'dotenv/config';

const port = Number(process.env.PORT) || 3000;
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
