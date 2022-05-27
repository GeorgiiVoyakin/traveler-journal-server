const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');

app.use(express.json());
app.use('/auth', authRouter);

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
