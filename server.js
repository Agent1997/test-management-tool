const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      // eslint-disable-next-line prettier/prettier
      useUnifiedTopology: true,
    });
    console.log('Connection Successful');
  } catch (err) {
    console.log(err);
  }
};

dbConnect();

app.listen(process.env.PORT, '127.0.0.1', () => {
  console.log('Server Listening');
});
