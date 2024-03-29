const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('Name: ', err.name);
  console.log('Message: ', err.message);
  console.log('Stack: ', err.stack);

  console.log('UNCAUGHT EXCEPTION. CLOSING THE SERVER');
  process.exit(1);
});

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

let server;

if (process.env.NODE_ENV === 'production') {
  server = app.listen(process.env.PORT, () => {
    console.log('Server Listening');
    console.log('prod');
  });
} else if (process.env.NODE_ENV === 'development') {
  server = app.listen(process.env.PORT_DEV, '127.0.0.1', () => {
    console.log('Server Listening');
  });
}

process.on('unhandledRejection', err => {
  console.log('Name: ', err.name);
  console.log('Message: ', err.message);
  console.log('Stack: ', err.stack);

  server.close(() => {
    console.log('UNHANDLED REJECT. CLOSING THE SERVER');
    process.exit(1);
  });
});
