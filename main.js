require('dotenv').config();
const express = require('express');
const emailRoutes = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 1722;

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

app.get('/', (_req, res) => {
  res.status(200).json({ status: 'online', service: 'Brasil Mega Lite Email API' });
});

app.use('/api/email', emailRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Email API listening on port ${PORT}`);
});
