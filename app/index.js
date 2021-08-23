const express = require("express");
const app = express();
const fetch = require('node-fetch');

app.use(express.json()) ;
app.use(express.urlencoded({ extended: true })) ;


//require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//API GET
app.get("/api*", async function (req, res) {
  const shatemURL = 'https://api.shate-m.ru';
  let shatemApiURL = shatemURL + req.originalUrl;//'/api/GetPrices'
  try {
    const fetch_response = await fetch(shatemApiURL, {
      method: 'GET',
      headers: {
        'Token': req.headers.token,
        'Content-Type': 'application/json'
      }
    });
    //const json = await fetch_response.json();

    res.setHeader('ShateM', true);
    //res.json(json);
    res.status(fetch_response.status);
    res.json(fetch_response.ok ? await fetch_response.json() : await fetch_response.text());
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get("/", async function (req, res) {
  console.log("Hello HealthCheck! Cloud Foudnry HealthCheck");
  try {
  const fetch_response = await fetch('https://api.shate-m.ru/api/HealthCheck/Check');
  res.setHeader('ShateM', true);
  //res.json(json);
  res.status(fetch_response.status);
  res.json(fetch_response.ok ? await fetch_response.json() : await fetch_response.text());
} catch (error) {
  console.log(error);
  res.send(error);
}
});

//LOGIN
app.post("/login", function (req, res) {
  fetch('https://api.shate-m.ru/login', {
    method: 'POST',
    //headers: headers,
    headers: {
      //   'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`, 'binary').toString('base64'), 
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)  //{ ApiKey: 'BCE52D94-41CA-4256-B92B-A363BF4A499B' };
  })
    .then(response => {
      const token = response.headers.get('Token');
      res.setHeader('Token', token);
      res.status(response.status);
      res.setHeader('ShateM', true);
      //return response.json()
      return response.ok ? response.json() : response.text()
    })
    .then(json => res.json(json))
    .catch(err => {
      console.log(err);
      res.send(err)
    })
});

//GetPrices
app.post("/aapi/search/GetPrices", function (req, res) {
  const shatemApiURL = 'https://api.shate-m.ru/api/search/GetPrices';
  // '{"Articles":[{"ArticleCode":"PCAM1001","TradeMarkName":"PATRON"}],"ShippingAddressCode":"10211"}'
  fetch('https://api.shate-m.ru/api/search/GetPrices', {
    method: 'POST',
    headers: {
      'Token': req.headers.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
    .then(response => {
      res.status(response.status);
      res.setHeader('ShateM', true);
      return response.ok ? response.json() : response.text()
    })
    .then(json => res.json(json))
    .catch(err => {
      console.log(err);
      res.send(err)
    })
});

//api POST all
app.post("/api*", function (req, res) {
  // '{"Articles":[{"ArticleCode":"PCAM1001","TradeMarkName":"PATRON"}],"ShippingAddressCode":"10211"}'
  const shatemURL = 'https://api.shate-m.ru';
  let shatemApiURL = shatemURL + req.originalUrl;
  // fetch('https://api.shate-m.ru/api/search/GetPrices', {
  fetch(shatemApiURL, {
    method: 'POST',
    headers: {
      'Token': req.headers.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
    .then(response => {
      res.status(response.status);
      res.setHeader('ShateM', true);
      return response.ok ? response.json() : response.text()
    })
    .then(json => res.json(json))
    .catch(err => {
      console.log(err);
      res.send(err)
    })
});




const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("app listening at port " + port);
});
