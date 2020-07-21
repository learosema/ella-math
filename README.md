# Ella

Geometry and linear algebra library that provides basic vector and matrix calculus operations.

## Features

Features:

- vector addition, subtraction, scalar multiplication, dot product, cross product
- calculate vector length
- normalize vector
- matrix multiplication, determinant, inverse implementations for mat2, mat3, mat4
- translation and projection matrices (perspective and orthogonal projection)
- matrix vector multiplication
- basic geometry shapes

## Install and usage

You can either import ella via NPM or directly use it via script tag.

### NPM:

First, run: `npm i ella-math`

```js
import { Vec, Mat, Mat4 } from 'ella-math';

const a = new Vec(1, 2, 3);
const b = new Vec(2, 3, 4);

console.log('a + b = ', a.add(b));
console.log('a dot b = ', a.dot(b));
console.log('a cross b = ', a.cross(b));

// Define a matrix
// heads up: it's the other way round as you would write it down on paper

// prettier-ignore
const m = new Mat([
  1, 2, 3, // column 1
  4, 5, 6, // column 2
  7, 8, 9, // column 3
]);

const mDet = m.determinant(); // 0
const mInv = m.inverse();
console.assert(
  mInv.isFinite() === false,
  'As the determinant of m is 0, there is no inverse of m.'
);

const mA = Mat4.identity();
// create a 4x4 translation matrix
const mB = Mat4.translation(-1, -2, -3);
// create a 4x4 scaling matrix
const mC = Mat4.scaling(2, 4, 6);
// matrix multiplication
const mD = mA.mul(mB);
console.assert(mD.equals(mB), 'mA * mB should equal mB');
const mE = mD.mul(mC);
// matrix division is like multiplication with its inverse
const mF = mE.div(mC);

console.assert(mF.isFinite(), 'mF should be finite.');
console.assert(mF.equals(mD), 'mF should be equal to mD');

// the equality check may sometimes fail in JS due
// to floating point arithmetics (.1+.2 !== .3 issue)
// roughlyEquals checks with a tolerance of 1e-14
console.assert(mF.roughlyEquals(mD), 'mF should be roughly equal to mD');
```

### Directly in the browser

Add this script tag: `<script src="https://unpkg.com/ella-math@latest/dist/ella.umd.js"></script>`

```js
const { Vec, Mat } = Ella;
```

### Demos

- [Ella 01 - rendering a sphere wireframe in an SVG path](https://codepen.io/terabaud/pen/MWazXyd)
- [Ella 02 - rendering a sphere in WebGL](https://codepen.io/terabaud/pen/wvMQQyr)
