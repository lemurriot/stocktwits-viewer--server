const express = require('express');
const fetch = require('node-fetch');

const searchRouter = express.Router();

searchRouter.route('/:symbol').get((req, res, next) => {
  const { symbol } = req.params;
  fetch(`https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Could not fetch data');
    })
    .then((stream) => res.send(stream))
    .catch(next);
});

module.exports = searchRouter;
