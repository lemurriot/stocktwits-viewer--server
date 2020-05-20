const express = require('express');
const fetch = require('node-fetch');

const symbolsRouter = express.Router();

symbolsRouter.route('/:symbols').get((req, res, next) => {
  const { symbols } = req.params;
  console.log(symbols);
  const symbolsArr = symbols.split('+');
  const response = async () =>
    Promise.all(
      symbolsArr.map((symbol) =>
        fetch(`https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`)
          .then((data) => data.json())
          .catch((err) => console.error(err.message))
      )
    );
  response().then((data) => {
    res.send(data);
  });
});

module.exports = symbolsRouter;
