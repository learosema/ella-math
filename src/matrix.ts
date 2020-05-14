import { Vec } from "./vector";

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
      throw Error("ArgumentError");
    }
  }

  /**
   * Converts a vector into a 1x(2|3|4) matrix with 1 row and n cols
   * useful for matrix multiplication
   * @param value the input vector
   */
  static fromVector(value: Vec): Mat {
    if (value instanceof Vec) {
      return new Mat(value.toArray(), { numRows: value.dim, numCols: 1 });
    }
    throw Error("unsupported type");
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
    throw Error("ArgumentError");
  }

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
    throw Error("ArgumentError");
  }

  mul(param: Mat | number | Vec): Mat | Vec {
    if (typeof param === "number") {
      const multipliedValues: number[] = this.values.map(
        (value) => value * param
      );
      return new Mat(multipliedValues, {
        numRows: this.numRows,
        numCols: this.numCols,
      });
    }
    if (param instanceof Vec) {
      const v = param as Vec;
      if (param.dim !== this.numCols) {
        throw Error("dimension mismatch");
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
    throw Error("ArgumentError");
  }

  determinant() {
    const { values } = this;
    if (values.length === 4) {
      return values[0] * values[3] - values[1] * values[2];
    }
  }

  toString() {
    const { numRows, numCols, values } = this;
    return `mat${numRows}x${numCols}(${values.join(", ")})`;
  }
}

export const Mat2 = {
  /**
   * create identity matrix
   */
  identity() {
    // prettier-ignore
    return new Mat([
      1, 0, // column1
      0, 1  // column2
    ]);
  },

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
   * create identity matrix
   */
  identity() {
    // prettier-ignore
    return new Mat([
      1, 0, 0, 
      0, 1, 0,
      0, 0, 1
    ]);
  },

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
   * @param sx
   * @param sy
   * @param sz
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
  identity() {
    // prettier-ignore
    return new Mat([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  },

  translation(x: number, y: number, z: number): Mat {
    // prettier-ignore
    return new Mat([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
  },

  scaling(sx: number, sy: number, sz: number): Mat {
    // prettier-ignore
    return new Mat([
      sx,  0,  0, 0,
       0, sy,  0, 0,
       0,  0, sz, 0,
       0,  0,  0, 1
    ]);
  },

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
