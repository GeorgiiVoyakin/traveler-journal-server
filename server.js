import express, { json } from 'express';
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3001;
import connect from 'mongoose';
import authRouter from './routes/authRouter';

app.use(json());
app.use('/auth', authRouter);

connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
