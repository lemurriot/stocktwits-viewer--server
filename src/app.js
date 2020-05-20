require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_URL } = require('./config');

const searchRouter = require('./routers/search-router');
const symbolRouter = require('./routers/symbol-router');
const symbolsRouter = require('./routers/symbols-router');

const port = process.env.PORT;

const routerApp = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

routerApp.use(morgan(morganOption));
routerApp.use(helmet());

const corsControl = cors({
  credentials: true,
  origin: 'https://stocktwits-viewer.now.sh/',
});

routerApp.use(corsControl);

routerApp.use('/api/search', searchRouter);
routerApp.use('/api/add', symbolRouter);
routerApp.use('/api/symbols', symbolsRouter);

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

routerApp.use(errorHandler);

routerApp.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = routerApp;
