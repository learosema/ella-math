import { Mat } from './matrix';

/**
 * create translation matrix
 * @param x translation in x-direction
 * @param y translation in y-direction
 * @returns 3x3 translation matrix
 */
export function translation(x: number, y: number): Mat {
  // prettier-ignore
  return new Mat([
    1, 0, 0,
    0, 1, 0,
    x, y, 1
  ]);
}

/**
 * create scaling matrix
 * @param sx scale X factor
 * @param sy scale Y factor
 * @param sz scale Z factor
 * @returns 3x3 scale matrix
 */
export function scaling(sx: number, sy: number, sz: number): Mat {
  // prettier-ignore
  return new Mat([
    sx,  0,  0, 
     0, sy,  0, 
     0,  0, sz
  ]);
}

/**
 * create X-rotation matrix
 * @param angle rotation in radians
 */
export function rotX(angle: number): Mat {
  const { sin, cos } = Math;
  const S = sin(angle);
  const C = cos(angle);
  // prettier-ignore
  return new Mat([
    1, 0, 0,
    0, C, S,
    0,-S, C
  ]);
}

/**
 * create Y-rotation matrix
 * @param angle angle in radians
 */
export function rotY(angle: number): Mat {
  const { sin, cos } = Math;
  const S = sin(angle);
  const C = cos(angle);
  // prettier-ignore
  return new Mat([
    C, 0,-S,
    0, 1, 0,
    S, 0, C
  ]);
}

/**
 * create Z-rotation matrix
 * @param angle angle in radians
 */
export function rotZ(angle: number): Mat {
  const { sin, cos } = Math;
  const S = sin(angle);
  const C = cos(angle);
  // prettier-ignore
  return new Mat([
     C, S, 0,
    -S, C, 0,
     0, 0, 1
  ]);
}
