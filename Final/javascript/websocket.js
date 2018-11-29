$(document).ready(
  init
)
// TODO: Add document strings to the secret, key and pass

/* Currently the script begins the callback queue that begins with my init
*  function. I call getUSDPairs to make an ajax request and pass the callback
*  filterUSDPairs to filter out the pairs I do not need. I then start the
*  websocket once the pairs are returned and 10 messages are returned before the
*  websocket is closed.
*
* According to the documentation, there is more information available in each
*  websocket message to users with an API key. I want a user to be able to
*  use their API key if they have one, so those with API keys will have a different
*  website load with more information than users that do not have an API key.
*
* Since the callback queue begins in the ajax request, how can I close the old
*  connection and make a new one with the API credentials? I would prefer there not
*  being two connections due to the extra overhead it provides.
*
* One way I think I might be able to solve it if there exists of a way I can
*  return an ajax request's data into a variable that I can use in a procedural context.
*  I have looked online but have not found any answers from the examples I saw.
*/

/**
* Initalize the javascript program
*/
function init() {
  /*var secret, key, pass;
  var verified = false;
  verify(verified);*/
  getUSDPairs(secret, key, pass);
}

// TODO: Implement verification method
function verify(flag) {
}

/**
* Start the websocket connection to Coinbase
*/
function startWebSocket(currPairs, secret, key, pass) {
  var ws = new WebSocket("wss://ws-feed.pro.coinbase.com")
  var count = 0;
  var startMsg = JSON.stringify(
    {
      "type": "subscribe",
      "product_ids": currPairs,
      "channels": ["full"]
    }
  );
  ws.onopen = function() {
    ws.send(startMsg);
  }
  ws.onmessage = function(evt) {
    console.log(evt.data);
    count++;
    if (count == 10) {
      ws.close();
    }
  }
}

/**
* Get USD currency pairs
*/
function getUSDPairs(secret, key, pass) {
  var endpoint = "/products";
  gdaxRESTReq(endpoint, secret, key, pass, filterUSDPairs);
}

/**
* Filter out pairs that use USD
* @param {JSON} data The data passed to the function
*/
function filterUSDPairs(data, secret, key, pass) {
  var currencyPairs = [];
  $.each(data, function (index, value) {
      if (value.quote_currency == "USD")
        currencyPairs.push(value.id);
    }
  );
  startWebSocket(currencyPairs, secret, key, pass);
}

/**
* Get an api result
* @param {string} endpoint The endpoint to reference for data
* @param {function} callback The callback function to call with the data
*/
function gdaxRESTReq(endpoint, secret, key, pass, callback) {
  var baseURI = "https://api.pro.coinbase.com";
  $.ajax(
    {
      url: baseURI + endpoint,
      type: "GET",
      dataType: "JSON",
      success: function(data) {
        callback(data);
      },
      error: function(data, txtStat, err) {
        console.log(err)
        console.log(data)
      }
    }
  );
}
