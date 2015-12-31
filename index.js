var request = require('request-promise');
var json = require('jsonify');
var _ = require('lodash');
var beepi = require('./beepi');

var searchQueryId;
var pages;
var Results = function() {
  return {
    name: '',
    mileage: 0,
    price: 0,
    vin: '',
    pic: '',
    url: ''
  };
};

var initialOpts = {
    method: 'POST',
    uri: beepi.initialUrl,
    body: beepi.opts,
    json: true // Automatically stringifies the body to JSON
};

var paginatedOpts = function(uri, page, query){
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
  pagOpts = new paginatedOpts(url, i, query);
  return request(pagOpts);
}

var all = [];

request(initialOpts)
  .then(function (body) {
    searchQueryId = body.searchQueryId;
    pages = +body.pageCounts;

    for(var i=1; i<(pages+1); i++) {
      requestIthPage(beepi.paginatedUrl, i, searchQueryId)
        .then(function (body) {
          all.push(body.carsOnSale);
          body.carsOnSale.forEach(function(car) {
            results         = new Results();
            results.name    = car.fullTitle,
            results.mileage = car.mileage,
            results.price   = car.salePrice,
            results.vin     = car.vin,
            results.pic     = 'https:' + car.carShotUrls.heroShotUrl,
            results.url     = 'https://www.beepi.com' + car.carPageUrl   
            console.log(json.stringify(results));
          });
        })
        .catch(function(er) {
          console.log('paginated API call failed... ', er);
        })
        .finally(function() {

        });
    }
  }) 
  .catch(function(er) {
    console.log('First API call failed... ', er);
  })
  .finally(function() {
    console.log(all);
  });

