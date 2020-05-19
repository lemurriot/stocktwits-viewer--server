const express = require('express');
const fetch = require('node-fetch');

const searchRouter = express.Router();

searchRouter.route('/:symbol').get(async (req, res, next) => {
  const { symbol } = req.params;
  const stream = await fetch(
    `https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  res.send(stream);
});

module.exports = searchRouter;
