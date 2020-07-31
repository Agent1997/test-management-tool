const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST, options);
    console.log('Connection Successful');
  } catch (err) {
    console.log(err);
  }
};

dbConnect();

app.listen(process.env.PORT, '127.0.0.1', () => {
  console.log('Server Listening');
});
