import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users: Record<string, any> = {};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0' });
});

app.post('/sync-demo', (req, res) => {
  const { userId, data } = req.body;
  const id = userId || `demo-${Date.now()}`;
  const savedAt = new Date().toISOString();
  if (data) {
    users[id] = data;
  }

  return res.json({
    success: true,
    userId: id,
    savedAt,
    demo: true,
    message: 'This is a demo sync endpoint. Your device progress can be saved and retrieved when connected.',
    dataSynopsis: {
      profile: data?.profile ?? 'unknown',
      historyLength: data?.history?.length ?? 0,
      subject: data?.subject ?? 'unknown',
    },
  });
});

app.post('/sync', (req, res) => {
  const { userId, data } = req.body;
  if (!userId || !data) {
    return res.status(400).json({ error: 'userId and data are required' });
  }
  users[userId] = data;
  return res.json({ success: true, savedAt: new Date().toISOString() });
});

app.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  return res.json({ profile: users[userId] || null });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Tutor sync backend listening on port ${port}`);
});
