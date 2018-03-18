"use strict"
$(document).ready(function () {
  var base_url_api = "https://api.binance.com";
  var wss_url = "wss://stream.binance.com:9443"

  var apiKey;
  var secretKey;

  $(".auth").on('click', function (e) {
    e.preventDefault();
    apiKey = $(".token").val();
    secretKey = $(".token_sec").val();

    $.ajax({
      type: 'GET',
      url: base_url_api,
      headers: {
        "X-MBX-APIKEY": apiKey,
        "Access-Control-Allow-Headers":'Content-Type',
        'Access-Control-Allow-Origin' : "*"
    }, success: function(){
      console.log("sucesso");
    }
    });
  });
});