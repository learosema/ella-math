# Ella

Geometry and linear algebra library that provides basic vector and matrix calculus operations.

## Features

Features:

- vector addition, subtraction, scalar multiplication, dot product, cross product
- calculate vector length
- normalize vector
- matrix multiplication, determinant,
- translation and projection matrices
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

console.log(a.add(b));
```

### Directly in the browser

Add this script tag: `<script src="https://unpkg.com/ella-math@latest/dist/ella.umd.js"></script>`

```js
const { Vec, Mat } = Ella;
```

### Demos

- [Ella 01 - rendering a sphere wireframe in an SVG path](https://codepen.io/terabaud/pen/MWazXyd)
