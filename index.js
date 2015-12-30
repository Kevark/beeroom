var request = require('request');
var json = require('jsonify');
var _ = require('lodash');

var beepiOpts = require('./beepiOpts');
var initialUrl = 'http://www.beepi.com/v1/listings/carsSearch';
var paginatedUrl = 'http://www.beepi.com/v1/listings/carsPageResults';
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

request.post(
  initialUrl,
	{json: beepiOpts}, 
  function (error, response, body) {
		if (!error && response.statusCode == 200) {
			searchQueryId = body.searchQueryId;
			pages = +body.pageCounts;

			for(var i=1; i<(pages+1); i++) {
				request.post(
          paginatedUrl,
					{json: 
						{
							PageId: i,
							searchQueryId: searchQueryId
						}
					},
          function (error, response, body) {
						if (!error && response.statusCode == 200) {
							body.carsOnSale.forEach(function(car) {
                results         = Results();
                results.name    = car.fullTitle,
                results.mileage = car.mileage,
                results.price   = car.salePrice,
                results.vin     = car.vin,
                results.pic     = 'https:' + car.carShotUrls.heroShotUrl,
                results.url     = 'https://www.beepi.com' + car.carPageUrl
                
                console.log(json.stringify(results));
							});
						}
		      }
        );
      }
    };
	}
);
