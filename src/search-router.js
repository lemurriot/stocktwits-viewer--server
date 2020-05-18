const express = require('express');
const fetch = require('node-fetch');

const searchRouter = express.Router();

searchRouter.route('/:searchterm').get((req, res, next) => {
  const { searchterm } = req.params;
  fetch(`https://api.stocktwits.com/api/2/search/symbols.json?q=${searchterm}`)
    .then((response) => response.json())
    .then((response) => {
      res.send(response);
    });
});

module.exports = searchRouter;
