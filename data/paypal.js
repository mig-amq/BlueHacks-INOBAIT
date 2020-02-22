const paypal = require('paypal-rest-sdk')
var CLIENT =
  'AfKNmv9U_I4XxdZ3UezuG7dwFjL_5IGi7GA0VZEiGLAZV';
var SECRET =
  'EDg4Cf8rvTeZgxucrEOpBHIu3hsDfHWok-jtTyHnOaQAnpIrhaM_POPpHB2dNx5C-tqRIL1Bwc_cQm_W';
var PAYPAL_API = 'https://api.sandbox.paypal.com';

paypal.configure({
  'mode': 'sandbox',
  'client_id': 'AfKNmv9U_I4XxdZ3UezuG7dwFjL_5IGi7GA0VZEiGLAZV-_2qPrxCM7pko3Ey_S-8Tkh5HqsOpl4SMS5',
  'client_secret': 'EDg4Cf8rvTeZgxucrEOpBHIu3hsDfHWok-jtTyHnOaQAnpIrhaM_POPpHB2dNx5C-tqRIL1Bwc_cQm_W'
})

var create_payment_json = {
  "intent": "sale",
  "payer": {
      "payment_method": "paypal"
  },
  "redirect_urls": {
      "return_url": "http://localhost:3000",
      "cancel_url": "http://localhost:3000"
  },
  "transactions": [{
      "item_list": {
          "items": [{
              "name": "Enka Subscription",
              "sku": "Subscription",
              "price": "2070.00",
              "currency": "PHP",
              "quantity": 1
          }]
      },
      "amount": {
          "currency": "PHP",
          "total": "2070.00"
      },
      "description": ""
  }]
};

module.exports = {
    json: create_payment_json,
    paypal: paypal
}