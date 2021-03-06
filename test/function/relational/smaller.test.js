// test smaller
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    smaller = math.smaller;

describe('smaller', function() {

  it('should compare two numbers correctly', function() {
    assert.equal(smaller(2, 3), true);
    assert.equal(smaller(2, 2), false);
    assert.equal(smaller(2, 1), false);
    assert.equal(smaller(0, 0), false);
    assert.equal(smaller(-2, 2), true);
    assert.equal(smaller(-2, -3), false);
    assert.equal(smaller(-3, -2), true);
  });

  it('should compare two floating point numbers correctly', function() {
    // Infinity
    assert.equal(smaller(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), false);
    assert.equal(smaller(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), false);
    assert.equal(smaller(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), false);
    assert.equal(smaller(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), true);
    assert.equal(smaller(Number.POSITIVE_INFINITY, 2.0), false);
    assert.equal(smaller(2.0, Number.POSITIVE_INFINITY), true);
    assert.equal(smaller(Number.NEGATIVE_INFINITY, 2.0), true);
    assert.equal(smaller(2.0, Number.NEGATIVE_INFINITY), false);
    // floating point numbers
    assert.equal(smaller(0.3 - 0.2, 0.1), false);
  });

  it('should compare two booleans', function() {
    assert.equal(smaller(true, true), false);
    assert.equal(smaller(true, false), false);
    assert.equal(smaller(false, true), true);
    assert.equal(smaller(false, false), false);
  });

  it('should compare mixed numbers and booleans', function() {
    assert.equal(smaller(2, true), false);
    assert.equal(smaller(1, true), false);
    assert.equal(smaller(0, true), true);
    assert.equal(smaller(true, 2), true);
    assert.equal(smaller(true, 1), false);
    assert.equal(smaller(false, 2), true);
  });

  it('should compare mixed numbers and null', function() {
    assert.equal(smaller(1, null), false);
    assert.equal(smaller(0, null), false);
    assert.equal(smaller(null, 1), true);
    assert.equal(smaller(null, 0), false);
  });

  it('should compare bignumbers', function() {
    assert.deepEqual(smaller(bignumber(2), bignumber(3)), true);
    assert.deepEqual(smaller(bignumber(2), bignumber(2)), false);
    assert.deepEqual(smaller(bignumber(3), bignumber(2)), false);
    assert.deepEqual(smaller(bignumber(0), bignumber(0)), false);
    assert.deepEqual(smaller(bignumber(-2), bignumber(2)), true);
  });

  it('should compare mixed numbers and bignumbers', function() {
    assert.deepEqual(smaller(bignumber(2), 3), true);
    assert.deepEqual(smaller(2, bignumber(2)), false);

    assert.equal(smaller(1/3, bignumber(1).div(3)), false);
    assert.equal(smaller(bignumber(1).div(3), 1/3), false);
  });

  it('should compare mixed booleans and bignumbers', function() {
    assert.deepEqual(smaller(bignumber(0.1), true), true);
    assert.deepEqual(smaller(bignumber(1), true), false);
    assert.deepEqual(smaller(bignumber(1), false), false);
    assert.deepEqual(smaller(bignumber(0), false), false);
    assert.deepEqual(smaller(false, bignumber(0)), false);
    assert.deepEqual(smaller(true, bignumber(0)), false);
    assert.deepEqual(smaller(true, bignumber(1)), false);
  });

  it('should compare two measures of the same unit correctly', function() {
    assert.equal(smaller(unit('100cm'), unit('10inch')), false);
    assert.equal(smaller(unit('99cm'), unit('1m')), true);
    //assert.equal(smaller(unit('100cm'), unit('1m')), false); // dangerous, round-off errors
    assert.equal(smaller(unit('101cm'), unit('1m')), false);
  });

  it('should apply configuration option epsilon', function() {
    var mymath = math.create();
    assert.equal(mymath.smaller(0.991, 1), true);
    mymath.config({epsilon: 1e-2});
    assert.equal(mymath.smaller(0.991, 1), false);
  });

  it('should throw an error if comparing a unit and a number', function() {
    assert.throws(function () {smaller(unit('100cm'), 22)});
  });

  it('should throw an error for two measures of different units', function() {
    assert.throws(function () {smaller(math.unit(5, 'km'), math.unit(100, 'gram'));});
  });

  it('should throw an error if comparing a unit and a bignumber', function() {
    assert.throws(function () {smaller(unit('100cm'), bignumber(22))});
  });

  it('should perform lexical comparison on two strings', function() {
    assert.equal(smaller('0', 0), false);
    assert.equal(smaller('abd', 'abc'), false);
    assert.equal(smaller('abc', 'abc'), false);
    assert.equal(smaller('abc', 'abd'), true);
  });

  it('should compare a string an matrix elementwise', function() {
    assert.deepEqual(smaller('B', ['A', 'B', 'C']), [false, false, true]);
    assert.deepEqual(smaller(['A', 'B', 'C'], 'B'), [true, false, false]);
  });

  it('should perform element-wise comparison on two matrices of same size', function() {
    assert.deepEqual(smaller([1,4,6], [3,4,5]), [true, false, false]);
    assert.deepEqual(smaller([1,4,6], matrix([3,4,5])), matrix([true, false, false]));
  });

  it('should throw an error when comparing complex numbers', function() {
    assert.throws(function () {smaller(complex(1,1), complex(1,2))}, TypeError);
    assert.throws(function () {smaller(complex(2,1), 3)}, TypeError);
    assert.throws(function () {smaller(3, complex(2,4))}, TypeError);
    assert.throws(function () {smaller(math.bignumber(3), complex(2,4))}, TypeError);
    assert.throws(function () {smaller(complex(2,4), math.bignumber(3))}, TypeError);
  });

  it('should throw an error with two matrices of different sizes', function () {
    assert.throws(function () {smaller([1,4,6], [3,4])});
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {smaller(1)}, error.ArgumentsError);
    assert.throws(function () {smaller(1, 2, 3)}, error.ArgumentsError);
  });

  it('should LaTeX smaller', function () {
    var expression = math.parse('smaller(1,2)');
    assert.equal(expression.toTex(), '\\left(1<2\\right)');
  });

});
