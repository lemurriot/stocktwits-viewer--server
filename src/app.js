const socketIo = require('socket.io');
const http = require('http');
const fetch = require('node-fetch');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const port = process.env.PORT || 8000;

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

const server = http.createServer(app);
const io = socketIo(server);
let interval;

io.on('connection', (socket) => {
  console.log('New client connected');
  if (interval) {
    clearInterval(interval);
  }
  const { params } = socket.handshake.query;
  interval = setInterval(() => getApiAndEmit(socket, params), 20000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket, params) => {
  const paramsArr = params.split(',');
  const response = async () =>
    Promise.all(
      paramsArr.map((symbol) =>
        fetch(`https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`)
          .then((res) => res.json())
          .catch((err) => console.error(err.message))
      )
    );
  response().then((data) => {
    socket.emit('FromAPI', data);
  });
};

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
