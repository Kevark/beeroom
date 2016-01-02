import * as Rx from 'rx';
import * as vroom from './vroom.js';

const carStream = Rx.Observable.fromPromise(vroom.cars);

carStream.subscribe(function(resp) {
  console.log(resp);
})