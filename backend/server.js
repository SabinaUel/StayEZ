
import express from 'express';

const port = process.env.PORT || 5000;

const app = express();

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);