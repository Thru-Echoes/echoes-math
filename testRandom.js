import * as rndm from 'random';

// Normal from random.js
var random = new rndm.Random();
var NORMAL = function(mean, stddev) {
    return random.normal(mean, stddev);
}

// Examples
print("trial1 - N(10, 1): ", NORMAL(10, 1));
print("trial2 - N(10, 1): ", NORMAL(10, 1));
print("trial3 - N(10, 1): ", NORMAL(10, 1));
print("trial4 - N(10, 1): ", NORMAL(10, 1));
print("trial5 - N(10, 1): ", NORMAL(10, 1));
