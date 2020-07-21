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
import { Vec, Mat } from 'ella-math';

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

const mInv = m.inverse();
const mResult = m.mul(mInv);
const mI = Mat.identity(3); // create an identity matrix with a dimension of 3

console.assert(
  mResult.equals(mI),
  'A matrix multiplied by its inverse should equal the identity matrix.'
);
```

### Directly in the browser

Add this script tag: `<script src="https://unpkg.com/ella-math@latest/dist/ella.umd.js"></script>`

```js
const { Vec, Mat } = Ella;
```

### Demos

- [Ella 01 - rendering a sphere wireframe in an SVG path](https://codepen.io/terabaud/pen/MWazXyd)
- [Ella 02 - rendering a sphere in WebGL](https://codepen.io/terabaud/pen/wvMQQyr)
