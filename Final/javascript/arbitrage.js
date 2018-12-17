$(document).ready(init);

function init() {
  let cbBaseURI = "https://api.pro.coinbase.com/";
  requestData(cbBaseURI + "products", [addArbitrageCycles, cycleUpdates]);
}

function addArbitrageCycles(data) {
  let headers = ["Sell", "Buy", "Buy", "Arbitrage Possible?"];
  let colClasses = ["sell", "buy1", "buy2", "arbVal"];
  let pairs = [];
  let validCombs = [];
  $(data).each(function(key, val) { pairs.push(val["id"]); } );
  cmbs = Combinatorics.permutation(pairs, 3);
  while (cmb = cmbs.next()) {
    let currPairs = [];
    for (let i = 0, curr; curr = cmb[i]; i++) currPairs.push(curr.split('-'));
    if (currPairs[0][0] == currPairs[2][1] && currPairs[0][1] == currPairs[1][1] && currPairs[1][0] == currPairs[2][0]
      || currPairs[0][0] == currPairs[1][0] && currPairs[0][1] == currPairs[2][1] && currPairs[1][1] == currPairs[2][0]
      || currPairs[0][0] == currPairs[2][0] && currPairs[0][1] == currPairs[1][0] && currPairs[1][1] == currPairs[2][1]) validCombs.push(cmb);
  }
  $("body").append("<div class=ArbitrageContainer>");
  $(".ArbitrageContainer").append("<table class=ArbitrageTable1>");
  $(".ArbitrageContainer").append("<div class=flexItem>");
  $(".flexItem").append("<p>When arbitrage is possible, the box will show green, otherwise it will show red.");
  $(".ArbitrageContainer").append("<table class=ArbitrageTable2>");
  $(".ArbitrageTable1").append("<tr class=ArbitrageHeaders>");
  $(".ArbitrageTable2").append("<tr class=ArbitrageHeaders>");
  for (let i = 0, header; header = headers[i]; i++) $(".ArbitrageHeaders").append("<th>" + header);
  $(validCombs).each(function(key, val) {
      if (key < validCombs.length / 2) $(".ArbitrageTable1").append("<tr class=comb" + key + ">");
      else $(".ArbitrageTable2").append("<tr class=comb" + key + ">");
      for (let i = 0, colClass; colClass = colClasses[i]; ++i) {
        $(".comb" + key).append("<td class=" + colClass + ">");
        $(".comb" + key + " td." + colClass).html(val[i]);
      }
    }
  );
  $("body").append("<hr>");
}

function cycleUpdates(data) {
  let rows = 0;
  let pairs = [];
  let priceData = {};
  $(data).each(function(key, val) { pairs.push(val["id"]); } );
  let ws = new WebSocket("wss://ws-feed.pro.coinbase.com");
  let msg = {
    "type": "subscribe",
    "product_ids": pairs,
    "channels": ["ticker"]
  };
  $("tr").each(function() {
      rows++;
    }
  );
  rows--;
  ws.onopen = function() { ws.send(JSON.stringify(msg)); }
  ws.onmessage = function(evt) {
    let data = JSON.parse(evt["data"]);
    if (data["type"] == "ticker") {
      priceData[data["product_id"]] = data["price"];
      $("tr").each(function(key, val) {
          if (key >= 0 && key < rows) {
            let res = -Math.log(priceData[$(".comb" + key + " td.sell").html()] * priceData[$(".comb" + key + " td.buy1").html()] * priceData[$(".comb" + key + " td.buy2").html()]);
            if (res < 0) {
              $(".comb" + key + " td.arbVal").html("true");
              $(".comb" + key + " td.arbVal").css("background-color", "green");
            }
            else {
              $(".comb" + key + " td.arbVal").html("false");
              $(".comb" + key + " td.arbVal").css("background-color", "red");
            }
          }
        }
      );
    }
  }
}
