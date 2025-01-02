const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: 'sandbox',
  client_id: 'your_sandbox_client_id',
  client_secret: 'your_sandbox_client_secret'
});


module.exports = paypal;
