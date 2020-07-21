import { Vec } from './vector';

/** @class Mat */
export class Mat {
  values: number[];
  numRows: number;
  numCols: number;

  constructor(
    values: number[],
    options?: { numRows: number; numCols: number }
  ) {
    this.values = values;
    if (options) {
      this.numRows = options.numRows;
      this.numCols = options.numCols;
    } else {
      const dimension = Math.sqrt(values.length);
      if (Number.isInteger(dimension)) {
        this.numCols = this.numRows = dimension;
        return;
      }
      throw Error('ArgumentError');
    }
  }

  /**
   * create identity matrix
   * @param dimension dimension of the matrix
   */
  static identity(dimension: number) {
    if (dimension <= 0 || !Number.isInteger(dimension)) {
      throw Error('ArgumentError');
    }
    return new Mat(
      Array(dimension ** 2)
        .fill(0)
        .map((_, i) => (i % dimension === ((i / dimension) | 0) ? 1 : 0))
    );
  }

  /**
   * Converts a vector with dimension n into a matrix with 1 col and n rows
   * useful for matrix multiplication
   * @param value the input vector
   */
  static fromVector(value: Vec): Mat {
    if (value instanceof Vec) {
      return new Mat(value.toArray(), { numRows: value.dim, numCols: 1 });
    }
    throw Error('unsupported type');
  }

  /**
   * Converts a bunch of vectors into a matrix
   */
  static fromVectors(vectors: Vec[]): Mat {
    if (!vectors || vectors.length === 0) {
      throw Error('Argument error.');
    }
    const dimensions: number[] = vectors.map((v) => v.dim);
    const dimensionsMatch = dimensions.every((x) => x === dimensions[0]);
    const dimension = dimensions[0];
    if (!dimensionsMatch) {
      throw Error('Dimensions mismatch.');
    }
    const matrix: number[] = Array(dimension * vectors.length);
    for (let i = 0; i < vectors.length; i++) {
      for (let j = 0; j < dimension; j++) {
        matrix[i + j * vectors.length] = vectors[i].values[j];
      }
    }
    return new Mat(matrix, { numRows: dimension, numCols: vectors.length });
  }

  /**
   * convert to array
   */
  toArray() {
    return this.values;
  }

  /**
   * get value at a given position
   * @param row row index starting from 0
   * @param column column index starting from 0
   */
  valueAt(row: number, column: number) {
    return this.values[column * this.numRows + row];
  }

  /**
   * get column at a given index
   * @param column index of column starting from 0
   * @returns column as an array of numbers
   */
  colAt(column: number) {
    const { numRows } = this;
    return this.values.slice(column * numRows, column * numRows + numRows);
  }

  /**
   * get row at a given index
   * @param row index of row starting from 0
   * @returns row as an array of numbers
   */
  rowAt(row: number) {
    const { numRows, numCols } = this;
    return Array(numCols)
      .fill(0)
      .map((_, column) => this.values[column * numRows + row]);
  }

  /**
   * returns transposed matrix
   */
  transpose() {
    const transposedValues: number[] = [];
    Array(this.numRows)
      .fill(0)
      .map((_, i) => {
        transposedValues.push(...this.rowAt(i));
      });
    return new Mat(transposedValues, {
      numRows: this.numCols,
      numCols: this.numRows,
    });
  }

  /**
   * check for equality
   * @param otherMatrix matrix to compare
   * @returns true or false
   */
  equals(otherMatrix: Mat) {
    if (
      this.values.length !== otherMatrix.values.length ||
      this.numCols !== otherMatrix.numCols ||
      this.numRows !== otherMatrix.numRows
    ) {
      return false;
    }
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] !== otherMatrix.values[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * add two matrices
   * @param otherMatrix matrix to add
   * @returns result matrix
   */
  add(otherMatrix: Mat) {
    if (
      this.numCols === otherMatrix.numCols &&
      this.numRows === otherMatrix.numRows &&
      this.values.length === otherMatrix.values.length
    ) {
      const newValues: number[] = this.values.map(
        (value, i) => value + otherMatrix.values[i]
      );
      return new Mat(newValues, {
        numRows: this.numRows,
        numCols: this.numCols,
      });
    }
    throw Error('ArgumentError');
  }

  /**
   * subtract another matrix
   * @param otherMatrix matrix to subtract
   * @returns result matrix
   */
  sub(otherMatrix: Mat) {
    if (
      this.numCols === otherMatrix.numCols &&
      this.numRows === otherMatrix.numRows &&
      this.values.length === otherMatrix.values.length
    ) {
      const newValues: number[] = this.values.map(
        (value, i) => value - otherMatrix.values[i]
      );
      return new Mat(newValues, {
        numRows: this.numRows,
        numCols: this.numCols,
      });
    }
    throw Error('ArgumentError');
  }

  /**
   * matrix multiplication
   * @param param can be a matrix, a number or a vector
   * @returns a vector in case of matrix vector multiplication, else a matrix
   * @throws dimension Mismatch if dimensions doesn't match
   */
  mul(param: Mat | number | Vec): Mat | Vec {
    if (typeof param === 'number') {
      const multipliedValues: number[] = this.values.map(
        (value) => value * param
      );
      return new Mat(multipliedValues, {
        numRows: this.numRows,
        numCols: this.numCols,
      });
    }
    if (param instanceof Vec) {
      if (param.dim !== this.numCols) {
        throw Error('dimension mismatch');
      }
      const m = this.mul(Mat.fromVector(param)) as Mat;
      return new Vec(...m.values);
    }
    if (param instanceof Mat) {
      const mat = param;
      const { numRows } = this;
      const { numCols } = mat;
      const multipliedValues: number[] = Array(numRows * numCols)
        .fill(0)
        .map((_, idx) => {
          const y = idx % numRows;
          const x = (idx / numRows) | 0;
          const row = this.rowAt(y);
          const col = mat.colAt(x);
          return row.map((value, i) => value * col[i]).reduce((a, b) => a + b);
        });
      return new Mat(multipliedValues, { numRows, numCols });
    }
    throw Error('ArgumentError');
  }

  div(param: number | Mat): Mat {
    if (typeof param === 'number') {
      const multipliedValues: number[] = this.values.map(
        (value) => value / param
      );
      return new Mat(multipliedValues, {
        numRows: this.numRows,
        numCols: this.numCols,
      });
    }
    if (param instanceof Mat) {
      const mat = param as Mat;
      const inversed: Mat | Vec | number = mat.inverse();
      return this.mul(inversed) as Mat;
    }
    throw Error('ArgumentError');
  }

  /**
   * calculate determinant, implemented for mat2, mat3, mat4
   */
  determinant() {
    const { numRows, numCols } = this;

    // glsl uses column major notation
    const m = (col: number, row: number) => this.valueAt(row, col);

    if (numRows !== numCols) {
      throw Error('ArgumentError');
    }
    if (numRows === 2) {
      return m(0, 0) * m(1, 1) - m(0, 1) * m(1, 0);
    }
    if (numRows === 3) {
      const a00 = m(0, 0),
        a01 = m(0, 1),
        a02 = m(0, 2);
      const a10 = m(1, 0),
        a11 = m(1, 1),
        a12 = m(1, 2);
      const a20 = m(2, 0),
        a21 = m(2, 1),
        a22 = m(2, 2);

      const b01 = a22 * a11 - a12 * a21;
      const b11 = -a22 * a10 + a12 * a20;
      const b21 = a21 * a10 - a11 * a20;

      return a00 * b01 + a01 * b11 + a02 * b21;
    }
    if (numRows === 4) {
      const a00 = m(0, 0),
        a01 = m(0, 1),
        a02 = m(0, 2),
        a03 = m(0, 3);
      const a10 = m(1, 0),
        a11 = m(1, 1),
        a12 = m(1, 2),
        a13 = m(1, 3);
      const a20 = m(2, 0),
        a21 = m(2, 1),
        a22 = m(2, 2),
        a23 = m(2, 3);
      const a30 = m(3, 0),
        a31 = m(3, 1),
        a32 = m(3, 2),
        a33 = m(3, 3);

      const b00 = a00 * a11 - a01 * a10;
      const b01 = a00 * a12 - a02 * a10;
      const b02 = a00 * a13 - a03 * a10;
      const b03 = a01 * a12 - a02 * a11;
      const b04 = a01 * a13 - a03 * a11;
      const b05 = a02 * a13 - a03 * a12;
      const b06 = a20 * a31 - a21 * a30;
      const b07 = a20 * a32 - a22 * a30;
      const b08 = a20 * a33 - a23 * a30;
      const b09 = a21 * a32 - a22 * a31;
      const b10 = a21 * a33 - a23 * a31;
      const b11 = a22 * a33 - a23 * a32;
      return (
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
      );
    }
    throw Error('ArgumentError');
  }

  /**
   * calculate M^-1 for mat2, mat3, mat4
   */
  inverse() {
    const { numRows, numCols } = this;
    if (numRows !== numCols) {
      throw Error('ArgumentError');
    }
    // glsl uses column major notation
    const m = (col: number, row: number) => this.valueAt(row, col);

    if (numRows === 2) {
      const det = m(0, 0) * m(1, 1) - m(0, 1) * m(1, 0);
      // prettier-ignore
      return new Mat([
         m(1, 1), -m(0, 1),
        -m(1, 0),  m(0, 0)
      ].map(x => x / det));
    }
    if (numRows === 3) {
      const a00 = m(0, 0),
        a01 = m(0, 1),
        a02 = m(0, 2);
      const a10 = m(1, 0),
        a11 = m(1, 1),
        a12 = m(1, 2);
      const a20 = m(2, 0),
        a21 = m(2, 1),
        a22 = m(2, 2);

      const b01 = a22 * a11 - a12 * a21;
      const b11 = -a22 * a10 + a12 * a20;
      const b21 = a21 * a10 - a11 * a20;

      const det = a00 * b01 + a01 * b11 + a02 * b21;

      return new Mat(
        [
          b01,
          -a22 * a01 + a02 * a21,
          a12 * a01 - a02 * a11,
          b11,
          a22 * a00 - a02 * a20,
          -a12 * a00 + a02 * a10,
          b21,
          -a21 * a00 + a01 * a20,
          a11 * a00 - a01 * a10,
        ].map((x) => x / det)
      );
    }
    if (numRows === 4) {
      const a00 = m(0, 0),
        a01 = m(0, 1),
        a02 = m(0, 2),
        a03 = m(0, 3);
      const a10 = m(1, 0),
        a11 = m(1, 1),
        a12 = m(1, 2),
        a13 = m(1, 3);
      const a20 = m(2, 0),
        a21 = m(2, 1),
        a22 = m(2, 2),
        a23 = m(2, 3);
      const a30 = m(3, 0),
        a31 = m(3, 1),
        a32 = m(3, 2),
        a33 = m(3, 3);

      const b00 = a00 * a11 - a01 * a10;
      const b01 = a00 * a12 - a02 * a10;
      const b02 = a00 * a13 - a03 * a10;
      const b03 = a01 * a12 - a02 * a11;
      const b04 = a01 * a13 - a03 * a11;
      const b05 = a02 * a13 - a03 * a12;
      const b06 = a20 * a31 - a21 * a30;
      const b07 = a20 * a32 - a22 * a30;
      const b08 = a20 * a33 - a23 * a30;
      const b09 = a21 * a32 - a22 * a31;
      const b10 = a21 * a33 - a23 * a31;
      const b11 = a22 * a33 - a23 * a32;

      const det =
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      return new Mat(
        [
          a11 * b11 - a12 * b10 + a13 * b09,
          a02 * b10 - a01 * b11 - a03 * b09,
          a31 * b05 - a32 * b04 + a33 * b03,
          a22 * b04 - a21 * b05 - a23 * b03,
          a12 * b08 - a10 * b11 - a13 * b07,
          a00 * b11 - a02 * b08 + a03 * b07,
          a32 * b02 - a30 * b05 - a33 * b01,
          a20 * b05 - a22 * b02 + a23 * b01,
          a10 * b10 - a11 * b08 + a13 * b06,
          a01 * b08 - a00 * b10 - a03 * b06,
          a30 * b04 - a31 * b02 + a33 * b00,
          a21 * b02 - a20 * b04 - a23 * b00,
          a11 * b07 - a10 * b09 - a12 * b06,
          a00 * b09 - a01 * b07 + a02 * b06,
          a31 * b01 - a30 * b03 - a32 * b00,
          a20 * b03 - a21 * b01 + a22 * b00,
        ].map((x) => x / det)
      );
    }
    throw Error('NotImplementedYet');
  }

  /**
   * Checks if the matrix contains NaN values
   * @returns true if one of the values is NaN
   */
  isNaN(): boolean {
    for (let value of this.values) {
      if (Number.isNaN(value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if the matrix contains NaN or Infinity values
   * @returns true if all values are finite (neither NaN nor Infinity)
   */
  isFinite(): boolean {
    for (let value of this.values) {
      if (!Number.isFinite(value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * convert matrix to string
   * @returns a string containing matROWSxCOLS(comma-separated-values)
   */
  toString() {
    const { numRows, numCols, values } = this;
    return `mat${numRows}x${numCols}(${values.join(', ')})`;
  }
}

export const Mat2 = {
  /**
   * create rotation matrix
   * @param angle angle in radians
   */
  rotation(angle: number): Mat {
    const S = Math.sin(angle);
    const C = Math.cos(angle);
    // prettier-ignore
    return new Mat([
       C, S, 
      -S, C
    ]);
  },

  /**
   * create scaling matrix
   * @param sx X-scale factor
   * @param sy Y-scale factor
   */
  scaling(sx: number, sy: number): Mat {
    // prettier-ignore
    return new Mat([
      sx, 0, 
      0, sy
    ]);
  },
};

export const Mat3 = {
  /**
   * create translation matrix
   * @param x translation in x-direction
   * @param y translation in y-direction
   * @returns 3x3 translation matrix
   */
  translation(x: number, y: number): Mat {
    // prettier-ignore
    return new Mat([
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ]);
  },

  /**
   * create scaling matrix
   * @param sx scale X factor
   * @param sy scale Y factor
   * @param sz scale Z factor
   * @returns 3x3 scale matrix
   */
  scaling(sx: number, sy: number, sz: number): Mat {
    // prettier-ignore
    return new Mat([
      sx,  0,  0, 
       0, sy,  0, 
       0,  0, sz
    ]);
  },

  /**
   * create X-rotation matrix
   * @param angle rotation in radians
   */
  rotX(angle: number): Mat {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    // prettier-ignore
    return new Mat([
      1, 0, 0,
      0, C, S,
      0,-S, C
    ]);
  },

  /**
   * create Y-rotation matrix
   * @param angle angle in radians
   */
  rotY(angle: number): Mat {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    // prettier-ignore
    return new Mat([
      C, 0,-S,
      0, 1, 0,
      S, 0, C
    ]);
  },

  /**
   * create Z-rotation matrix
   * @param angle angle in radians
   */
  rotZ(angle: number): Mat {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    // prettier-ignore
    return new Mat([
      C, S, 0,
	   -S, C, 0,
	    0, 0, 1
    ]);
  },
};

export const Mat4 = {
  /**
   * create 4x4 identity matrix
   */
  identity() {
    // prettier-ignore
    return new Mat([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  },

  /**
   * create translation matrix
   * @param x translation in X direction
   * @param y translation in Y direction
   * @param z translation in Z direction
   */
  translation(x: number, y: number, z: number): Mat {
    // prettier-ignore
    return new Mat([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
  },

  /**
   * create scaling matrix
   * @param sx X-scale factor
   * @param sy Y-scale factor
   * @param sz Z-scale factor
   */
  scaling(sx: number, sy: number, sz: number): Mat {
    // prettier-ignore
    return new Mat([
      sx,  0,  0, 0,
       0, sy,  0, 0,
       0,  0, sz, 0,
       0,  0,  0, 1
    ]);
  },

  /**
   * create x-rotation matrix
   * @param angle angle in radians
   */
  rotX(angle: number): Mat {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    // prettier-ignore
    return new Mat([
      1, 0, 0, 0,
      0, C, S, 0,
      0,-S, C, 0,
      0, 0, 0, 1
    ]);
  },

  /**
   * create y-rotation matrix
   * @param angle angle in radians
   */
  rotY(angle: number): Mat {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    // prettier-ignore
    return new Mat([
      C, 0,-S, 0,
      0, 1, 0, 0,
      S, 0, C, 0,
      0, 0, 0, 1
    ]);
  },

  /**
   * create z-rotation matrix
   * @param angle angle in radians
   */
  rotZ(angle: number): Mat {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    // prettier-ignore
    return new Mat([
      C, S, 0, 0,
	   -S, C, 0, 0,
	    0, 0, 1, 0,
	    0, 0, 0, 1
    ]);
  },
};
