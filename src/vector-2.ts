// idea: provide a single Vector class instead of Vec2, Vec3, Vec4
export class V {
  values: number[];
  
  constructor(...values: number[]) {
    this.values = values;
  }

  /**
   * Create vector from Array
   * @param arr array of numbers
   */
  static fromArray(arr: number[]): V {
    return new V(...arr);
  }

  /**
   * Create vector with x = y = n
   * @param n the number
   * @param dim the dimension
   */
  static fromNumber(n: number, dim: number): V {
    return new V(...Array(dim).fill(n));
  }

  /**
   * clone vector
   */
  clone(): V {
    return new V(...this.values);
  }

  /**
   * add vector
   * @param otherVec addend
   * @returns addition result
   */
  add(otherVec: V): V {
    return new V(...this.values.map((val: number, i: number) => val + otherVec.values[i]));
  }


}