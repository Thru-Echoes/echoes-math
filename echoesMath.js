/**
 * @fileOverview General math / stat / modeling library in JS.
 * @author <a href="mailto:omuellerklein@berkeley.edu">Oliver Muellerklein</a>
*/

// Import random.js for random number generation
//import * as rndm from 'random';

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
//var random = new rndm.Random();
var NORMAL = function(mean, stddev) {
    //return random.normal(mean, stddev);
    return true;
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
    var tMin = min;
    var tMax = max;
    var tMod = 0;

    // Test for min = max - 1 percent change
    if (min == max) {
        tMod = (min * 0.01);
        tMin = min - tMod;
        tMax = max + tMod;
    }

	do {
		num = NORMAL(mean, stddev);
	} while(num < tMin || num > tMax);
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

/**
 * Generate histogram with dynamic number of bins.
 *
 * @param {array} df - data array
 * @param {number} nBins - number of bins
 *
 * @returns {object} - frequencies for bins
*/
var HISTOGRAM = function(df, nBins) {
    var dfLength, dfMin, dfMax, dfRange;
    var binSize;
    var histReturn;

    var allBins = [];
    var allCounts = [];

    // SORT
    df = ASORT(df);
    // descending with DSORT();

    // LENGTH
    dfLength = df.length;

    // MIN & MAX
    dfMin = df[0];
    dfMax = df[dfLength - 1];

    // RANGE
    dfRange = dfMax - dfMin;

    // HISTOGRAM BINS
    binSize = (dfRange / nBins);

    for (var z = 1; z < (nBins + 1); z++) {
        allBins.push(z * binSize);
        allCounts.push(0);
    }

    for (var i = 0; i < dfLength; i++) {

        for (var j = 0; j < nBins; j++) {

            if (df[i] < allBins[j]) {
                allCounts[j]++;
                break;
            } else if (j == (nBins - 1)) {
                allCounts[j]++;
                break;
            }
        }
    }

    histReturn = {
        allBins: allBins,
        allCounts: allCounts
    }

    return histReturn;

}

/**
 * Ascending sorting of array
 *
 * @param {array} unSorted
 *
 * @returns {array}
*/
var ASORT = function(unSorted) {
    return unSorted.sort(function(a, b) { return a - b; });
}

/**
 * Descending sorting of array
 *
 * @param {array} unSorted
 *
 * @returns {array}
*/
var DSORT = function(unSorted) {
    return unSorted.sort(function(a, b) { return b - a; });
}

/**
 * Get summary statistics of data .
 *
 * @param {array} initDF - data to get summary of
 *
 * @returns {object} sumStats
*/
var SUMMARY = function(initDF) {
    var sumStats, dfMean, dfMedian, dfQ1, dfQ3, dfRange;
    var dfMin, dfMax, dfLength, medIndx, halfLen;
    var lowIndx, hiIndx, lowValue, hiValue, testFloor;

    var q1Indx, q3Indx, q1Check, dfIQR, xIQR;
    var lowOut = [];
    var hiOut = [];
    var nOutliers = 0;

    // Make 5 bin histogram + freq
    var bin1, bin2, bin3, bin4;
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    var count5 = 0;

    var dfTotal = 0;
    var df;

    // SORT
    df = ASORT(initDF);
    // descending with DSORT();

    // LENGTH
    dfLength = df.length;

    // MIN & MAX
    dfMin = df[0];
    dfMax = df[dfLength - 1];

    // RANGE
    dfRange = dfMax - dfMin;

    // HISTOGRAM BINS
    bin1 = (dfRange / 5);
    bin2 = bin1 + bin1;
    bin3 = bin2 + bin1;
    bin4 = bin3 + bin1;

    // TOTAL
    for (var i = 0; i < dfLength; i++) {
        dfTotal += df[i];

        if (df[i] < bin1) {
            count1++;
        } else if (df[i] < bin2) {
            count2++;
        } else if (df[i] < bin3) {
            count3++;
        } else if (df[i] < bin4) {
            count4++;
        } else {
            count5++;
        }
    }

    // MEAN
    dfMean = dfTotal / dfLength;

    // MEDIAN & IQR
    halfLen = dfLength / 2;
    testFloor = Math.floor(halfLen);

    // Odd if halfLen != testFloor
    if (halfLen != testFloor) {

        medIndx = testFloor;
        dfMedian = df[medIndx];
        q1Check = medIndx / 2;
        q1Indx = Math.floor(q1Check);
        q3Indx = Math.round(halfLen) + q1Indx;

        lowValue = df[q1Indx - 1];
        hiValue = df[q1Indx];
        dfQ1 = ((lowValue + hiValue) / 2);

        lowValue = df[q3Indx - 1];
        hiValue = df[q3Indx];
        dfQ3 = ((lowValue + hiValue) / 2);

    // Even if halfLen == testFloor
    } else {

        lowIndx = testFloor - 1;
        hiIndx = testFloor;
        lowValue = df[lowIndx];
        hiValue = df[hiIndx];
        dfMedian = ((lowValue + hiValue) / 2);

        q1Indx = lowIndx / 2;
        q3Indx = testFloor + q1Indx;
        dfQ1 = df[q1Indx]
        dfQ3 = df[q3Indx]
    }

    // IQR
    dfIQR = Math.abs(dfQ3) - Math.abs(dfQ1);
    xIQR = dfIQR * 1.5;

    // OUTLIERS
    for (var k = 0; k < dfLength; k++) {

        if (df[k] < (dfQ1 - xIQR)) {
            lowOut.push(df[k]);
            nOutliers++;
        }

        if (df[k] > (dfQ3 + xIQR)) {
            hiOut.push(df[k]);
            nOutliers++;
        }
    }

    sumStats = {
        mean: dfMean,
        median: dfMedian,
        q1: dfQ1,
        q3: dfQ3,
        iqr: dfIQR,
        outliers: nOutliers,
        min: dfMin,
        max: dfMax,
        range: dfRange,
        length: dfLength,
        total: dfTotal,
        data: df,
        count1: count1,
        count2: count2,
        count3: count3,
        count4: count4,
        count5: count5
    }

    return sumStats;
}

/** @example */
var getAns = [];
for (var i = 0; i < 10000; i++) {
    getAns.push(UNIFORM(0, 100, true));
}
var getStats = SUMMARY(getAns);
var getHist = HISTOGRAM(getAns, 10);
print("\n--------------\n");
print("var getStats = SUMMARY(getAns);\n")
print("getStats.length: ", getStats.length);
print("getStats.total: ", getStats.total);
print("getStats.mean: ", getStats.mean);
print("getStats.median: ", getStats.median);
print("getStats.min: ", getStats.min);
print("getStats.max: ", getStats.max);
print("getStats.range: ", getStats.range);
print("\n--------------\n");
print("getStats.q1: ", getStats.q1);
print("getStats.q3: ", getStats.q3);
print("getStats.iqr: ", getStats.iqr);
print("getStats.outliers: ", getStats.outliers);
print("\n--------------\n");
/*print("getStats.count1: ", getStats.count1);
print("getStats.count2: ", getStats.count2);
print("getStats.count3: ", getStats.count3);
print("getStats.count4: ", getStats.count4);
print("getStats.count5: ", getStats.count5);*/
//print("getStats.data: ", getStats.data);

print("\n--------------\n");
//print("var getHist = HISTOGRAM(getAns, 10);")
//print("getHist.allBins: ", getHist.allBins);
//print("getHist.allCounts: ", getHist.allCounts);
print("\n");

/** @example */
/*print("trial1 - N(10, 1): ", NORMAL(10, 1));
print("trial2 - N(10, 1): ", NORMAL(10, 1));
print("trial3 - N(10, 1): ", NORMAL(10, 1));
print("trial4 - N(10, 1): ", NORMAL(10, 1));
print("trial5 - N(10, 1): ", NORMAL(10, 1));*/

/** @example */
/*print("UNIFORM(min, max, whol) - whol = T or F for rounding to whole numbers");
print("Trial 1 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 2 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 3 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 4 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 5 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 6 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 7 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 8 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 9 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("Trial 10 - UNIFORM(13, 19, true): ", UNIFORM(13, 19, true));
print("\n--------------\n");
print("Trial 1 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 2 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 3 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 4 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 5 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 6 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 7 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 8 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 9 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("Trial 10 - UNIFORM(13, 19, false): ", UNIFORM(13, 19, false));
print("\n");*/
