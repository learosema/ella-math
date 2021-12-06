import { Mat } from './matrix';

/**
 * create rotation matrix
 * @param angle angle in radians
 */
export function rotation(angle: number): Mat {
  const S = Math.sin(angle);
  const C = Math.cos(angle);
  // prettier-ignore
  return new Mat([
     C, S, 
    -S, C
  ]);
}

/**
 * create scaling matrix
 * @param sx X-scale factor
 * @param sy Y-scale factor
 */
export function scaling(sx: number, sy: number): Mat {
  // prettier-ignore
  return new Mat([
    sx, 0, 
    0, sy
  ]);
}