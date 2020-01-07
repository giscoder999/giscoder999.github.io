// Copyright 2011 The Closure Library Authors. All Rights Reserved.
// Use of this source code is governed by the Apache License, Version 2.0.

goog.provide('goog.vec.Float64ArrayTest');
goog.setTestOnly('goog.vec.Float64ArrayTest');

goog.require('goog.vec.Float64Array');
goog.require('goog.testing.jsunit');

function testConstructorInitializesElementsToZero() {
  var f = new goog.vec.Float64Array(3);
  assertEquals(3, f.length);
  assertEquals(0, f[0]);
  assertEquals(0, f[1]);
  assertEquals(0, f[2]);
  assertEquals(8, f.BYTES_PER_ELEMENT);
  assertEquals(8, goog.vec.Float64Array.BYTES_PER_ELEMENT);
}

function testConstructorWithArrayAsArgument() {
  var f0 = new goog.vec.Float64Array([0, 0, 1, 0]);
  var f1 = new goog.vec.Float64Array(4);
  f1[0] = 0;
  f1[1] = 0;
  f1[2] = 1;
  f1[3] = 0;
  assertObjectEquals(f0, f1);
}

function testSet() {
  var f0 = new goog.vec.Float64Array(4);
  var f1 = new goog.vec.Float64Array(4);
  f0.set([1, 2, 3, 4]);
  f1[0] = 1;
  f1[1] = 2;
  f1[2] = 3;
  f1[3] = 4;
  assertObjectEquals(f0, f1);
}

function testSetWithOffset() {
  var f0 = new goog.vec.Float64Array(4);
  var f1 = new goog.vec.Float64Array(4);
  f0.set([5], 1);
  f1[0] = 0;
  f1[1] = 5;
  f1[2] = 0;
  f1[3] = 0;
  assertObjectEquals(f0, f1);
}

function testToString() {
  var f = new goog.vec.Float64Array([4, 3, 2, 1]);
  assertEquals('4,3,2,1', f.toString());
}
