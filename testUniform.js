// Test random...uniform vs. non-uniform distribution
function randomRange(min, max) {
    var randRetrn = Math.random() * (max - min) + min;
    return randRetrn;
}

function roundRange(min, max) {
    var roundRetrn = Math.round(Math.random() * (max - min)) + min;
    return roundRetrn;
}

function floorRange(min, max) {
    var floorRetrn = Math.floor(Math.random() * (max - min)) + min;
    return floorRetrn;
}

// Testing...
// Try 0 to 1, 0 to 10, 1 to 50, -10 to 10
var ttl = 1000;

// 0 to 1
var data = {};
var zeroOne;

for (var i = 0; i < ttl; i++) {
    zeroOne = randomRange(0, 1);
    //zeroOne = roundRange(0, 1);
    //zeroOne = floorRange(0, 1);
    if (typeof data[zeroOne] === 'undefined') {
        data[zeroOne] = zeroOne;
    } else {
        data[zeroOne] = data[zeroOne] + zeroOne;
    }
}
print("zeroOne: ");

/*
// 0 to 10
var data = {};
var zeroTen;

for (var i = 0; i < 100000; i++) {
    zeroTen = randomRange(0, 10);
    //zeroTen = roundRange(0, 10);
    //zeroTen = floorRange(0, 10);
    if (typeof data[zeroTen] === 'undefined') {
        data[zeroTen] = zeroTen;
    } else {
        data[zeroTen] = data[zeroTen] + zeroTen;
    }
}
print("zeroTen: ", data);

// 1 to 50
var data = {};
var oneFifty;

for (var i = 0; i < 100000; i++) {
    oneFifty = randomRange(1, 50);
    //oneFifty = roundRange(1, 50);
    //oneFifty = floorRange(1, 50);
    if (typeof data[oneFifty] === 'undefined') {
        data[oneFifty] = oneFifty;
    } else {
        data[oneFifty] = data[oneFifty] + oneFifty;
    }
}
print("oneFifty: ", data);

// -10 to 10
var data = {};
var tenTen;

for (var i = 0; i < 100000; i++) {
    tenTen = randomRange(-10, 10);
    //tenTen = roundRange(-10, 10);
    //tenTen = floorRange(-10, 10);
    if (typeof data[tenTen] === 'undefined') {
        data[tenTen] = tenTen;
    } else {
        data[tenTen] = data[tenTen] + tenTen;
    }
}
print("tenTen: ", data);
*/
