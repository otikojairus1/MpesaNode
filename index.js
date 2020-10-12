const functions = require("firebase-functions");
const request = require("request");
const express = require("express");

const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Mpesa endpoints for payment intergrations",
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Mpesa endpoints for payment intergrations",
  });
});

app.get("/paymentgateway", (req, res) => {
  var token1;

  (consumer_key = "fvZIruUqimKaaSydZMocTwwk04aseI9q"),
    (consumer_secret = "itwQkUJ7QGuNo7HQ"),
    (url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials");
  auth =
    "Basic " +
    new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

  request(
    {
      url: url,
      headers: {
        Authorization: auth,
      },
    },
    function (error, response, body) {
      // TODO: Use the body object to extract OAuth access token
      responceToken = JSON.parse(body).access_token;
      //mpesa credentials

      const mpesaOnlinePasskey =
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
      const date = new Date().getDate();
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const Hours = new Date().getHours();
      const minutes = new Date().getMinutes();
      const seconds = new Date().getSeconds();

      const Timestampe = year + month + date + Hours + minutes + seconds;

      console.log(Timestampe);
      //const Timestampe = "2020" + "10" + "12" + "16" + "04" + "00";
      const dataToEncode = "174379" + mpesaOnlinePasskey + Timestampe;
      let buff = new Buffer(dataToEncode);
      let base64data = buff.toString("base64");

      //simulate transaction

      (oauth_token = responceToken),
        (url =
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest");
      auth = "Bearer " + oauth_token;

      request(
        {
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          json: {
            BusinessShortCode: "174379",
            Password: base64data,
            Timestamp: Timestampe,
            TransactionType: "CustomerPayBillOnline",
            Amount: "1",
            PartyA: "254726928060",
            PartyB: "174379",
            PhoneNumber: "254726928060",
            CallBackURL: "https://otiko.com/callback",
            AccountReference: "FAIDAMORE2020",
            TransactionDesc: "Pay for your investment FAIDA MORE",
          },
        },
        function (error, response, body) {
          // TODO: Use the body object to extract the response
          console.log(body);
        }
      );

      return res.status(200).json({
        message:
          "CONGATULATIONS!! payment request was successful from our side, wait for the pin prompt.",
      });
    }
  );
});

// app.get("/", (req, res) => {

// });

exports.paymentApi = functions.https.onRequest(app);
