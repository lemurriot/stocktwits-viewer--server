const express = require('express');
const fetch = require('node-fetch');

const searchRouter = express.Router();

searchRouter.route('/:searchterm').get((req, res, next) => {
  const { searchterm } = req.params;
  fetch(`https://api.stocktwits.com/api/2/search/symbols.json?q=${searchterm}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Could not fetch data');
    })
    .then((response) => {
      res.send(response);
    })
    .catch(next);
});

module.exports = searchRouter;
