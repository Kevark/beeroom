'use strict';

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _rx = require('rx');

var Rx = _interopRequireWildcard(_rx);

var _jsonify = require('jsonify');

var json = _interopRequireWildcard(_jsonify);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _beepi = require('./beepi.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var request = require('request-promise'); //this lib doesnt work with es2015 syntax

var searchQueryId;
var pages;

var all = [];

var initialOpts = {
  method: 'POST',
  uri: _beepi.beepi.initialUrl,
  body: _beepi.beepi.opts,
  json: true // Automatically stringifies the body to JSON
};

var paginatedOpts = function paginatedOpts(uri, page, query) {
  return {
    method: 'POST',
    uri: uri,
    body: {
      PageId: page,
      searchQueryId: query
    },
    json: true
  };
};

function requestIthPage(url, i, query) {
  var pagOpts = new paginatedOpts(url, i, query);
  return request(pagOpts);
}

var initialStream = Rx.Observable.fromPromise(request(initialOpts));

initialStream.subscribe(function (response) {
  searchQueryId = response.searchQueryId;
  pages = _.range(1, 1 + response.pageCounts);
}, function (err) {
  console.log('initial API call failed... ', err);
}, function () {
  //on complete
  var promiseStream = Rx.Observable.from(pages).flatMap(function (page) {
    return Rx.Observable.fromPromise(requestIthPage(_beepi.beepi.paginatedUrl, page, searchQueryId));
  });

  promiseStream.subscribe(function (response) {
    //do some filter or mapping here to cut out the crap from beepi only need:
    // results.name    = car.fullTitle,
    //      results.mileage = car.mileage,
    //      results.price   = car.salePrice,
    //      results.vin     = car.vin,
    //      results.pic     = 'https:' + car.carShotUrls.heroShotUrl,
    //      results.url     = 'https://www.beepi.com' + car.carPageUrl,
    //      results.src     = 'Beepi'  
    all = [].concat(_toConsumableArray(all), _toConsumableArray(response.carsOnSale));
  }, function (err) {
    console.log(err);
  }, function () {
    //on complete
    var out = all.map(function (car) {
      return {
        mileage: car.mileage,
        price: car.salePrice,
        vin: car.vin,
        pic: 'https:' + car.carShotUrls.heroShotUrl,
        url: 'https://www.beepi.com' + car.carPageUrl,
        src: 'Beepi'
      };
    });
    fs.writeFile('/home/sam/beeroom/results.json', json.stringify(out), function (err) {
      if (err) {
        return console.log('there was an error writing to disk ', err);
      }
      console.log('saved to results.json');
    });
  });
});