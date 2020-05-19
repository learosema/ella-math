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

  valueAt(row: number, column: number) {
    return this.values[column * this.numRows + row];
  }

  colAt(column: number) {
    const { numRows } = this;
    return this.values.slice(column * numRows, column * numRows + numRows);
  }

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

  /**
   * calculate determinant
   */
  determinant() {
    const { numRows, numCols } = this;
    const v = this.values;
    if (numRows !== numCols) {
      throw Error('ArgumentError');
    }
    if (numRows === 2) {
      return v[0] * v[3] - v[1] * v[2];
    }
    if (numRows === 3) {
      // a0 d1 g2
      // b3 e4 h5
      // c6 f7 i8
      // aei + bfg + cdh
      //-gec - hfa - idb
      return (
        v[0] * v[4] * v[8] +
        v[3] * v[7] * v[2] +
        v[6] * v[1] * v[5] -
        v[2] * v[4] * v[6] -
        v[5] * v[7] * v[0] -
        v[8] * v[1] * v[3]
      );
    }
    throw Error('NotImplementedYet');
  }

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
