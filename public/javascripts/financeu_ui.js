// TODO: use var exchangeCount = []
// to implement a running count of which exchange
// trades a taking place

var symbols = []
var socket = io.connect();
$(document).ready(function() {
  $("#tickerForm").fadeIn(500);

  getQuoteStream(socket);
  getTradeStream(socket);
  getQuoteData(socket);
  getTickerInput(socket, symbols)
});

function getTickerInput(socket, symbols) {
  $('#tickerForm').submit(function(event) {
    event.preventDefault();
    var quote = $('#tickerInput').val();
    socket.emit('tickerInput', quote);    
    symbols.unshift([quote.toUpperCase(), quote]);
    newTradeViewGraph(symbols);
  })
}

function getQuoteData(socket) {
  socket.on('quoteData', function(result) {
    if (result.success) {
      $('#askBox').text(result.ask);
      $('#betaBox').text(result.beta);
      $('#fiftyTwoWeekHighBox').text(result.wk52hi);
      $('#fiftyTwoWeekLowBox').text(result.wk52lo);
      $('#nameBox').text(result.name);
      $('#epsBox').text(result.eps);
    } else {
      $('#badTickerBox').text('incorrect ticker');
    }
  });
}

function getQuoteStream(socket) {
  socket.on('quoteStream', function(result) {
    if (result.success) {
      var date = new Date(result.datetime);
      var time = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      
      $('#quoteBid').text(result.bid);
      $('#quoteBidSize').text(result.bidSize);
      $('#quoteAsk').text(result.ask);
      $('#quoteAskSize').text(result.askSize);
      $('#symbol').text(result.symbol);
      $('#quoteExchange').text(result.exchange);
      $('#stream-quote-table').prepend(
        '<tr>' +
        '<td>' + result.symbol + '</td>' +
        '<td>' + time + '</td>' +
        '</tr>')
      
      if ($("#stream-quote-table tr").length > 10) {
        $("#stream-quote-table tr:last").remove();
      }
    }
  });
}

function getTradeStream(socket) {
  var tradeStreamArray = []
  socket.on('tradeStream', function(result) {
    if (result.success) {
      var date = new Date(result.datetime);
      var time = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");      
      $('#tradeExchange').text(result.exchange);
      $('#stream-trade-table').prepend(
        '<tr>' + 
        '<td>' + result.symbol + '</td>' + 
        '<td>' + result.last + '</td>' +
        '<td>' + result.vwap + '</td>' + 
        '<td>' + time + '</td>' + 
        '</tr>')
        
      if ($("#stream-trade-table tr").length > 10) {
        $("#stream-trade-table tr:last").remove();
      }
    }
  });
}

function newTradeViewGraph(symbols) {
  new TradingView.MediumWidget({
    "container_id": "bigGraph",
    "symbols": symbols,
    "gridLineColor": "#E9E9EA",
    "fontColor": "#83888D",
    "underLineColor": "#F0F0F0",
    "timeAxisBackgroundColor": "#E9EDF2",
    "trendLineColor": "#FF7965",
    "width": '100%',
    "height": 350
  });
}