'use strict';

var _rx = require('rx');

var Rx = _interopRequireWildcard(_rx);

var _vroom = require('./vroom.js');

var vroom = _interopRequireWildcard(_vroom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var carStream = Rx.Observable.fromPromise(vroom.cars);

carStream.subscribe(function (resp) {
  console.log(resp);
});