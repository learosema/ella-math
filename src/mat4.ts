import { Mat } from './matrix';
import { Vec } from './vector';

/**
 * create 4x4 identity matrix
 */
export function identity(): Mat {
  // prettier-ignore
  return new Mat([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

/**
 * create translation matrix
 * @param x translation in X direction
 * @param y translation in Y direction
 * @param z translation in Z direction
 */
export function translation(x: number, y: number, z: number): Mat {
  // prettier-ignore
  return new Mat([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]);
}

/**
 * create scaling matrix
 * @param sx X-scale factor
 * @param sy Y-scale factor
 * @param sz Z-scale factor
 */
export function scaling(sx: number, sy: number, sz: number): Mat {
  // prettier-ignore
  return new Mat([
    sx,  0,  0, 0,
     0, sy,  0, 0,
     0,  0, sz, 0,
     0,  0,  0, 1
  ]);
}

/**
 * create x-rotation matrix
 * @param angle angle in radians
 */
export function rotX(angle: number): Mat {
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
}

/**
 * create y-rotation matrix
 * @param angle angle in radians
 */
export function rotY(angle: number): Mat {
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
}

/**
 * create z-rotation matrix
 * @param angle angle in radians
 */
export function rotZ(angle: number): Mat {
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
}

/**
 * Create a lookup matrix.  BREAKING CHANGE: now, lookup returns the lookup matrix, not the view matrix (use .inverse() to get the view matrix)
 * @param position position of the camera
 * @param target position where you want to look at
 * @param up upward direction vector, quite often (0,1,0)
 * @returns lookup matrix
 * @see https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
 */
export function lookAt(position: Vec, target: Vec, up: Vec): Mat {
  const zAxis = position.sub(target).normalized;
  const xAxis = up.cross(zAxis).normalized;
  const yAxis = zAxis.cross(xAxis).normalized;
  return new Mat([
    xAxis.x,
    xAxis.y,
    xAxis.z,
    0,
    yAxis.x,
    yAxis.y,
    yAxis.z,
    0,
    zAxis.x,
    zAxis.y,
    zAxis.z,
    0,
    position.x,
    position.y,
    position.z,
    1,
  ]);
}