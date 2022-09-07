const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const corsMiddleware = require('./middleware/corsMiddleware');
const authRouter = require('./routes/authRouter');
const noteRouter = require('./routes/noteRouter');
const userRouter = require('./routes/userRouter');

app.use(corsMiddleware);
app.use(express.json());
app.use('/auth', authRouter);
app.use('/note', noteRouter);
app.use('/user', userRouter);

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
