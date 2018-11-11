//npm modules
const express = require('express');
const uuid = require('uuid/v4');
const helmet = require('helmet');
const session = require('express-session');
const bodyParser = require('body-parser');
const Binance = require('../../node_modules/node-binance-api');
const binance = new Binance();

let port = process.env.PORT || 8080;

// create the server 
const app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// add & configure middleware
app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  secret: 'something different',
  resave: false,
  saveUninitialized: true
}));

// create the homepage route at '/'
app.get('/auths', (req, res) => {
  let apikey = req.query.apikey;
  let secretkey = req.query.secretkey;
  binance.options({
    APIKEY: apikey,
    APISECRET: secretkey,
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
  
  });

  res.send("Succesful Connection with Binance Server")
});

app.get('/targets', (req, res) => {
  let amount = req.query.amount;
  let pair = req.query.pair;
  let stop_loss = req.query.stop;
  let apikey = req.query.apikey;
  let secretkey = req.query.secretkey;
  binance.options({
    APIKEY: apikey,
    APISECRET: secretkey,
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
  
  });
  binance.marketBuy(pair, amount);
  binance.sell(pair, amount, stop_loss, {
    stopPrice: stop_loss,
    type: "STOP_LOSS"
  });

  res.send("Buy and Stop loss Recorded.");
});

app.get('/nexttargets', (req, res) => {
  let pair = req.query.pair;
  let amount = req.query.amount;
  let target1 = req.query.t1;
  let target2 = req.query.t2;
  let target3 = req.query.t3;
  let target4 = req.query.t4;
  let stop = req.query.stop;
  let apikey = req.query.apikey;
  let secretkey = req.query.secretkey;
  binance.options({
    APIKEY: apikey,
    APISECRET: secretkey,
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
  
  });



  let amountSell1 = ((amount * req.body.p1) / 100).toFixed(8);
  let amountSell2 = ((amount - amountSell1 * req.body.p2) / 100).toFixed(8);
  let amountSell3 = ((amount - amountSell1 - amountSell2 * req.body.p3) / 100).toFixed(8);
  let amountSell4 = ((amount - amountSell1 - amountSell2 - amountSell3 * req.body.p4) / 100).toFixed(8);

  let actualPrice;

  binance.prices(pair, (error, ticker) => {
    actualPrice = parseFloat(ticker[pair]);
    if (actualPrice >= target1 && actualPrice < target2) {
      binance.cancelOrders(pair, (error, response, symbol) => {
        console.log(symbol + " cancel response:", response);
      });
      binance.marketSell(pair, amountSell1);
      console.log("first target");
      amount = amount - amountSell1;
      binance.sell(pair, amount, (target1 - target1 * 0.1), {
        stopPrice: (target1 - target1 * 0.15),
        type: "STOP_LOSS"
      });
      stop = target1 - target1 * 0.15;
      res.send("Target Acquired");
    } else if (actualPrice >= target2 && actualPrice < target3) {
      binance.cancelOrders(pair, (error, response, symbol) => {
        console.log(symbol + " cancel response:", response);
      });
      binance.marketSell(pair, amountSell2);
      amount = amount - amountSell2;
      binance.sell(pair, amount, (target2 - target2 * 0.1), {
        stopPrice: (target2 - target2 * 0.15),
        type: "STOP_LOSS"
      });
      stop = target2 - target2 * 0.15;
      res.send("Target Acquired");
    } else if (actualPrice >= target3 && actualPrice < target4) {
      binance.cancelOrders(pair, (error, response, symbol) => {
        console.log(symbol + " cancel response:", response);
      });
      binance.marketSell(pair, amountSell3);
      amount = amount - amountSell3;
      binance.sell(pair, amount, (target3 - target3 * 0.1), {
        stopPrice: (target3 - target3 * 0.15),
        type: "STOP_LOSS"
      });
      stop = target3 - target3 * 0.15
      res.send("Target Acquired");
    } else if (actualPrice >= target4) {
      binance.cancelOrders(pair, (error, response, symbol) => {
        console.log(symbol + " cancel response:", response);
      });
      binance.marketSell(pair, amountSell4);
      amount = amount - amountSell4;
      res.send("Target Acquired");
    } else if (actualPrice < stop) {
      res.send(`Stop Acquired ${pair}`);
    }else{
      res.send("Analysing the market.")
    }
  });
  
});

// tell the server what port to listen on
app.listen(port, () => {
  console.log('Listening server port: ' + port);
});