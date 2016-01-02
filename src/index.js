import * as fs from 'fs';
var request = require('request-promise'); //this lib doesnt work with es2015 syntax
import * as Rx from 'rx';
import * as json from 'jsonify';
import * as _ from 'lodash';
import { beepi } from './beepi.js';

var searchQueryId;
var pages;

var all = [];

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
  const pagOpts = new paginatedOpts(url, i, query);
  return request(pagOpts);
}

var initialStream = Rx.Observable.fromPromise(request(initialOpts));

initialStream.subscribe(
  function(response) {
    searchQueryId = response.searchQueryId;
    pages = _.range(1, 1+response.pageCounts);
  },
  function(err) {
    console.log('initial API call failed... ', err);
  },
  function() {
    //on complete
    var promiseStream = Rx.Observable.from(pages)
      .flatMap(function(page) {
        return Rx.Observable.fromPromise(requestIthPage(beepi.paginatedUrl, page, searchQueryId));
      });

    promiseStream.subscribe(
      function(response) {
        //do some filter or mapping here to cut out the crap from beepi only need:
        // results.name    = car.fullTitle,
        //      results.mileage = car.mileage,
        //      results.price   = car.salePrice,
        //      results.vin     = car.vin,
        //      results.pic     = 'https:' + car.carShotUrls.heroShotUrl,
        //      results.url     = 'https://www.beepi.com' + car.carPageUrl,
        //      results.src     = 'Beepi'   
        all = [...all,
        ...response.carsOnSale
        ];
      },
      function(err) {
        console.log(err);
      },
      function() {
        //on complete
        var out = all.map(function(car) {
          return {
            mileage: car.mileage,
            price: car.salePrice,
            vin: car.vin,
            pic: 'https:' + car.carShotUrls.heroShotUrl,
            url: 'https://www.beepi.com' + car.carPageUrl,
            src: 'Beepi'
          };
        });
        fs.writeFile('/home/sam/beeroom/results.json', json.stringify(out), function(err) {
          if(err) {
            return console.log('there was an error writing to disk ', err);
          }
          console.log('saved to results.json');
        });
    });
});
