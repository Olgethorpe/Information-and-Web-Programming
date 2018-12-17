$(document).ready(init);

function init() {
  let cbBaseURI = "https://api.pro.coinbase.com/";
  requestData(cbBaseURI + "products", [addExchangeRates, livePriceUpdates]);
}

function addExchangeRates(data) {
  let headers = ["Currency Pair", "Exchange Rate", "Status", "Status Message", "Base Currency",
    "Quote Currency", "Quote Increment", "Min Order Size", "Max Order Size", "Min Market Funds",
    "Max Market Funds", "Post Orders Only", "Limit Orders Only", "Canel Orders Only", "Margin Trading"];
  let colClasses = ["id", "exchangeRate", "status", "status_message", "base_currency",
    "quote_currency", "quote_increment", "base_min_size", "base_max_size", "min_market_funds",
    "max_market_funds", "post_only", "limit_only", "cancel_only", "margin_enabled"];
  let inputClasses = $(colClasses).not(["_exchangeRate"]).get();
  $("body").append("<div class=ExchangeRateContainer>");
  $(".ExchangeRateContainer").append("<table class=ExchangeRateTable>");
  $(".ExchangeRateTable").append("<tr class=ExchangeRateHeaders>");
  for (let i = 0, header; header = headers[i]; ++i) $(".ExchangeRateHeaders").append("<th>" + header + "</th>");
  $.each(data, function(key, val) {
      let rowRef = "." + val["id"];
      $(".ExchangeRateTable").append("<tr class=" + val["id"] + ">");
      for (let i = 0, colClass; colClass = colClasses[i]; i++) $(rowRef).append("<td class=" + colClass + ">");
      for (let i = 0, inputClass; inputClass = inputClasses[i]; i++) {
        if (inputClass == "status_message" && (val[inputClass] == null || val[inputClass] == ''))
          $(rowRef + " td." + inputClass).html("Healthy");
        else
          $(rowRef + " td." + inputClass).html(String(val[inputClass]));
      }
    }
  );
  $("body").append("<hr>");
}

function livePriceUpdates(data) {
  let pairs = []
  $(data).each(function(key, val) { pairs.push(val["id"]); } );
  let ws = new WebSocket("wss://ws-feed.pro.coinbase.com");
  let msg = {
    "type": "subscribe",
    "product_ids": pairs,
    "channels": ["ticker"]
  };
  ws.onopen = function() { ws.send(JSON.stringify(msg)); }
  ws.onmessage = function(evt) {
    let data = JSON.parse(evt["data"]);
    if (data["type"] == "ticker") {
      let inputClass = "." + data["product_id"];
      let val = $(inputClass + " td.quote_increment").html().split('.');
      let price = parseFloat(data["price"]).toFixed(val[1].length);
      let oldPrice = parseFloat($(inputClass + " td.exchangeRate").html());
      $(inputClass + " td.exchangeRate").html(price);
      if (price >= oldPrice) $(inputClass + " td.exchangeRate").css("background-color", "green");
      else $(inputClass + " td.exchangeRate").css("background-color", "red");
    }
  }
}
