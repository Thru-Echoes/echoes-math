/**
 * @fileOverview General math / stat / modeling library in JS.
 * @author <a href="mailto:omuellerklein@berkeley.edu">Oliver Muellerklein</a>
*/

// Import random.js for random number generation
import * as rndm from 'random';

/**
 * Random number from scaled uniform distribution.
 *
 * @param {number} min - minimum number for range.
 * @param {number} max - maximum number for range.
 * @param {boolean} whol - T or F: whole numbers or not.
 *
 * @returns {number} - Returns random uniform number.
*/
var UNIFORM = function(min, max, whol) {
    var uniRetrn;

    if (whol) {
        // Return whole numbers
        uniRetrn = Math.floor(Math.random() * (max - min)) + min;
    } else {
        uniRetrn = Math.random() * (max - min) + min;
    }
    return uniRetrn;
}

/**
 * Binomial distribution: n trials with p success.
 *
 * @param {number} n - number of (Bernoulli) trials.
 * @param {number} p - probability of success.
 *
 * @returns {number} - Returns accumulation of Bernoulli trials.
*/
var BINOMIAL = function(n, p) {
    var sumBern = 0;
    for (var i = 0; i < n; i++) {

        if (Math.random() < p) {
            sumBern++;
        }
    }
    return sumBern;
}

// Normal from random.js
var random = new rndm.Random();
var NORMAL = function(mean, stddev) {
    return random.normal(mean, stddev);
}

/**
 * Random number generated from a normal distribution within a range.
 *
 * @param {number} mean
 * @param {number} stddev - standard deviation.
 * @param {number} min - minimum range.
 * @param {number} max - maximum range.
 *
 * @returns {number} num - NORMAL in range.
*/
var NORMAL_RANGE = function(mean, stddev, min, max) {
	var num;
	do {
		num = NORMAL(mean, stddev);
	} while(num < min || num > max);
	return num;
}

/**
 * Calculate log-normal number.
 *
 * @param {number} mean - geometric mean
 * @param {number} stddev - geometric standard deviation.
 * @param {number} num - single normal number.
 *
 * @returns {number} logNum - log-normal of normal number.
*/
var LOGNORMAL = function(mean, stddev, num) {
	var logNum = num * Math.log(stddev) + Math.log(mean);
	return Math.round(Math.exp(logNum));
}

/** @example */
print("trial1 - N(10, 1): ", NORMAL(10, 1));
print("trial2 - N(10, 1): ", NORMAL(10, 1));
print("trial3 - N(10, 1): ", NORMAL(10, 1));
print("trial4 - N(10, 1): ", NORMAL(10, 1));
print("trial5 - N(10, 1): ", NORMAL(10, 1));
