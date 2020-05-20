const express = require('express');
const fetch = require('node-fetch');

const symbolsRouter = express.Router();

symbolsRouter.route('/:symbols').get((req, res, next) => {
  const { symbols } = req.params;
  const symbolsArr = symbols.split('+');
  const response = async () =>
    Promise.all(
      symbolsArr.map((symbol) =>
        fetch(`https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`)
          .then((data) => {
            if (data.ok) {
              return data.json();
            }
            throw new Error('Could not retrieve data stream');
          })
          .catch(next)
      )
    );
  response().then((data) => {
    try {
      if (data[0] && data[0].response.status === 200) {
        res.send(data);
      } else {
        throw new Error('Could not send data');
      }
    } catch (err) {
      next(err);
    }
  });
});

module.exports = symbolsRouter;
