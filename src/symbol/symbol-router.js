const express = require('express');
const fetch = require('node-fetch');

const symbolRouter = express.Router();

symbolRouter.route('/:symbol').get((req, res, next) => {
  const { symbol } = req.params;
  fetch(`https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`)
    .then((response) => response.json())
    .then((response) => {
      res.send(response);
    });
});

module.exports = symbolRouter;
