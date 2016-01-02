'use strict';

var _request = require('request');

var request = _interopRequireWildcard(_request);

var _jsonify = require('jsonify');

var jsonify = _interopRequireWildcard(_jsonify);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//this is stupid now, but when these things are user-defined it will make more sense

//require('request-debug')(request); //uncomment for helpful console debugging info
var baseUrl = 'https://www.vroom.com/catalog/all-years/all-makes/';
var bodystyles = ['Wagon', 'Hatchback'];
var maxPrice = 20000;
var maxMiles = 60000;

var qs = {
  price_min: 1000,
  price_max: maxPrice,
  mileage: maxMiles
};

var vroomForm = {
  SkipVehiclesAmount: 0,
  PageSize: 100
};

var preQueryString = bodystyles.join(',');

function getSession() {
  request.get({
    jar: true,
    url: baseUrl,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  }, function (err, response, body) {
    getCars();
  });
}

function getCars() {
  request.post({
    url: baseUrl + preQueryString,
    qs: qs,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    },
    form: vroomForm
  }, function (err, response, body) {
    var cars = jsonify.parse(body)['Data']['Cars'];
    console.log(cars);
    return cars;
  });
}

getSession();

//export { getCars, getSession };