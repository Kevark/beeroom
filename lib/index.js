var fs = require('fs');
var request = require('request-promise');
var Rx = require('rx');
var json = require('jsonify');
var _ = require('lodash');
var beepi = require('./beepi');

var searchQueryId;
var pages;

var all = [];

var initialOpts = {
  method: 'POST',
  uri: beepi.initialUrl,
  body: beepi.opts,
  json: true // Automatically stringifies the body to JSON
};

var paginatedOpts = function (uri, page, query) {
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

var initialStream = Rx.Observable.fromPromise(request(initialOpts));

initialStream.subscribe(function (response) {
  searchQueryId = response.searchQueryId;
  pages = _.range(1, 1 + response.pageCounts);
}, function (err) {
  console.log('initial API call failed... ', err);
}, function () {
  //on complete
  var promiseStream = Rx.Observable.from(pages).flatMap(function (page) {
    return Rx.Observable.fromPromise(requestIthPage(beepi.paginatedUrl, page, searchQueryId));
  });

  promiseStream.subscribe(function (response) {
    all = [...all, ...response.carsOnSale];
  }, function (err) {
    console.log(err);
  }, function () {
    //on complete
    fs.writeFile('../results.json', json.stringify(all), function (err) {
      if (err) {
        return console.log('there was an error writing to disk ', err);
      }
      console.log('saved to results.json');
    });
  });
});