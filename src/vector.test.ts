import { Vec } from './vector';

describe('2D Vector arithmetics', () => {
  test('Vec constructor', () => {
    const vector = new Vec(1, 2);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
  });

  test('Vec clone', () => {
    const vector = new Vec(1, 2);
    const copied = vector.clone();
    expect(copied.x).toBe(1);
    expect(copied.y).toBe(2);
  });

  test('Vec swizzling', () => {
    const v = new Vec(1, 2, 3, 4);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
    expect(v.z).toBe(3);
    expect(v.w).toBe(4);
    expect(v.xy.equals(new Vec(1, 2))).toBeTruthy();
    expect(v.xz.equals(new Vec(1, 3))).toBeTruthy();
    expect(v.yz.equals(new Vec(2, 3))).toBeTruthy();
    expect(v.xyz.equals(new Vec(1, 2, 3))).toBeTruthy();
  });

  test('Vec fromNumber factory', () => {
    const vector = Vec.fromNumber(3, 2);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(3);
  });

  test('Vec fromArray factory', () => {
    const vector = Vec.fromArray([3, 5]);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(5);
  });

  test('Vec addition', () => {
    const v1 = new Vec(1, 2);
    const v2 = new Vec(3, 5);
    const v3 = v1.add(v2);
    expect(v3.x).toBe(4);
    expect(v3.y).toBe(7);
  });

  test('Vec substraction', () => {
    const v1 = new Vec(1, 2);
    const v2 = new Vec(3, 5);
    const v3 = v1.sub(v2);
    expect(v3.x).toBe(-2);
    expect(v3.y).toBe(-3);
  });

  test('Vec multiplication', () => {
    const v1 = new Vec(1, 2);
    const v2 = v1.mul(7);
    expect(v2.x).toBe(7);
    expect(v2.y).toBe(14);
  });

  test('Vec division', () => {
    const v1 = new Vec(7, 14);
    const v2 = v1.div(7);
    expect(v2.x).toBe(1);
    expect(v2.y).toBe(2);
  });

  test('Vec length', () => {
    const vector = new Vec(3, 4);
    expect(vector.length).toBe(5);
  });

  test('Vec sqrLength', () => {
    const v = new Vec(3, 4);
    expect(v.sqrLength).toBe(25);
  });


  test('Vec lerp test', () => {
    const x = new Vec(2, 0);
    const y = new Vec(0, 2);
    const a = .5;
    const expected = new Vec(1, 1);
    expect(x.lerp(y, a).equals(expected)).toBe(true);
  })

  test('Vec equality', () => {
    const v1 = new Vec(1, 1);
    const v2 = new Vec(1, 1);
    expect(v1.equals(v2)).toBe(true);
  });

  test('Vec dot product', () => {
    const v1 = new Vec(2, 3);
    const v2 = new Vec(5, 7);
    expect(v1.dot(v2)).toBe(31);
  });

  test('Vec toArray conversion', () => {
    const v = new Vec(3, -2);
    expect(v.toArray()).toEqual([3, -2]);
  });

  test('Vec toString conversion', () => {
    const vector = new Vec(3, -2);
    expect(vector.toString()).toBe('(3, -2)');
  });
});

describe('3D Vector arithmetics', () => {
  test('Vec constructor with 3 values', () => {
    const vector = new Vec(1, 2, 3);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(3);
  });

  test('Vec constructor with array as argument', () => {
    const vector = Vec.fromArray([1, 2, 3]);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(3);
  });

  test('Vec clone', () => {
    const vector = new Vec(1, 2, 3).clone();
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(3);
  });

  test('Vec fromNumber factory', () => {
    const vector = Vec.fromNumber(3, 3);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(3);
    expect(vector.z).toBe(3);
  });

  test('Vec addition', () => {
    const v1 = new Vec(1, 2, 3);
    const v2 = new Vec(3, 5, 7);
    const v3 = v1.add(v2);
    expect(v3.x).toBe(4);
    expect(v3.y).toBe(7);
    expect(v3.z).toBe(10);
  });

  test('Vec substraction', () => {
    const v1 = new Vec(1, 2, 3);
    const v2 = new Vec(3, 5, 7);
    const v3 = v1.sub(v2);
    expect(v3.x).toBe(-2);
    expect(v3.y).toBe(-3);
    expect(v3.z).toBe(-4);
  });

  test('Vec multiplication', () => {
    const v1 = new Vec(1, 2, 3);
    const v2 = v1.mul(7);
    expect(v2.x).toBe(7);
    expect(v2.y).toBe(14);
    expect(v2.z).toBe(21);
  });

  test('Vec division', () => {
    const v1 = new Vec(7, 14, 21);
    const v2 = v1.div(7);
    expect(v2.x).toBe(1);
    expect(v2.y).toBe(2);
    expect(v2.z).toBe(3);
  });

  test('Vec length', () => {
    const vector = new Vec(3, 4, 5);
    expect(vector.length).toBeCloseTo(7.071, 3);
  });

  test('Vec normalized', () => {
    const vector = new Vec(3, 4, 5);
    const expected = new Vec(0.42, 0.57, 0.71);
    const actual = vector.normalized;
    expect(actual.x).toBeCloseTo(expected.x);
    expect(actual.y).toBeCloseTo(expected.y);
    expect(actual.z).toBeCloseTo(expected.z);
  });

  test('Vec equality', () => {
    const v1 = new Vec(1, 3, 4);
    const v2 = new Vec(1, 3, 4);
    expect(v1.equals(v2)).toBe(true);
  });

  test('Vec dot product', () => {
    const v1 = new Vec(2, 3, 4);
    const v2 = new Vec(5, 7, 6);
    expect(v1.dot(v2)).toBe(55);
  });

  test('Vec cross product', () => {
    const v1 = new Vec(2, 3, 4);
    const v2 = new Vec(5, 7, 6);
    const v3 = new Vec(-10, 8, -1);
    expect(v1.cross(v2).equals(v3)).toBe(true);
  });

  test('Vec cross product with vectors of dimensions other than 3 should throw an error.', () => {
    const v1 = new Vec(1, 2, 3);
    const v2 = new Vec(1);
    expect(() => v1.cross(v2)).toThrowError();
    expect(() => v2.cross(v1)).toThrowError();
  });


  test('Vec toArray conversion', () => {
    const vector = new Vec(3, -2, 1);
    expect(vector.toArray()).toEqual([3, -2, 1]);
  });

  test('Vec toString conversion', () => {
    const vector = new Vec(3, -2, 1);
    expect(vector.toString()).toBe('(3, -2, 1)');
  });
});

describe('Vec 4D tests', () => {
  test('Vec constructor', () => {
    const vec = new Vec(1, 2, 3, 4);
    expect(vec.toArray()).toEqual([1, 2, 3, 4]);
  });

  test('Vec clone', () => {
    const vec = new Vec(1, 2, 3, 4);
    const clone = vec.clone();
    expect(clone.toArray()).toEqual([1, 2, 3, 4]);
  });

  test('Vec fromArray factory', () => {
    const vec = Vec.fromArray([1, 2, 3, 4]);
    expect(vec.toArray()).toEqual([1, 2, 3, 4]);
  });

  test('Vec fromNumber factory', () => {
    const vec = Vec.fromNumber(1, 4);
    expect(vec.toArray()).toEqual([1, 1, 1, 1]);
  });

});
