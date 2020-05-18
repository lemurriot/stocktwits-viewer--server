const socketIo = require('socket.io');
const http = require('http');
const fetch = require('node-fetch');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const searchRouter = require('./search-router');

const port = process.env.PORT || 8000;
const port2 = process.env.PORT2 || 8001;

const app = express();
const routerApp = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
routerApp.use(morgan(morganOption));
routerApp.use(helmet());

const corsControl = cors({
  credentials: true,
  origin: 'http://localhost:3000',
});

app.use(corsControl);
routerApp.use(corsControl);

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  let interval;
  console.log('New client connected');
  if (interval) {
    clearInterval(interval);
  }
  const { params } = socket.handshake.query;
  interval = setInterval(() => getApiAndEmit(socket, params), 120000);
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

routerApp.use('/api', searchRouter);

function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
}

app.use(errorHandler);
routerApp.use(errorHandler);

server.listen(port, () => console.log(`Sockets listening on port ${port}`));

routerApp.listen(port2, () => {
  console.log(`RoutingServer listening on port ${port2}`);
});

module.exports = app;
