import * as request from 'request';
//require('request-debug')(request); //uncomment for helpful console debugging info
import * as jsonify from 'jsonify';
import * as fs from 'fs';

//this is stupid now, but when these things are user-defined it will make more sense
const baseUrl = 'https://www.vroom.com/catalog/all-years/all-makes/';
const bodystyles = ['Wagon', 'Hatchback'];
const maxPrice = 20000;
const maxMiles = 60000;

const qs = {
  price_min: 1000,
  price_max: maxPrice,
  mileage: maxMiles
};

const vroomForm = {
  SkipVehiclesAmount:0,
  PageSize:100
}

const preQueryString = bodystyles.join(',');

function getSession() {
  request.get({
    jar: true,
    url: baseUrl,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  }, function(err,response, body) {
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
  }, function(err,response,body){
    const cars = jsonify.parse(body)['Data']['Cars'];
    console.log(cars);
    return cars;
  })
}

getSession();
