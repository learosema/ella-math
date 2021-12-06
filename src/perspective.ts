import { Mat } from './matrix';

/**
 * creates a transformation that produces a parallel projection
 * @param left coordinate for the left vertical clipping planes.
 * @param right coordinate for the right vertical clipping planes.
 * @param bottom coordinate for the bottom horizontal clippling pane.
 * @param top coordinate for the top horizontal clipping pane
 * @param zNear Specify the distances to the nearer and farther depth clipping planes. These values are negative if the plane is to be behind the viewer.
 * @param zFar Specify the distances to the nearer and farther depth clipping planes. These values are negative if the plane is to be behind the viewer.
 * @returns 4x4 orthographic transformation matrix
 * @see https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glOrtho.xml
 */
export function ortho(
  left: number,
  right: number,
  bottom: number,
  top: number,
  zNear: number,
  zFar: number
): Mat {
  const tx = -(right + left) / (right - left);
  const ty = -(top + bottom) / (top - bottom);
  const tz = -(zFar + zNear) / (zFar - zNear);
  // prettier-ignore
  return new Mat([
    2 / (right - left), 0, 0,
    0, 0, 2 / (top - bottom), 0,
    0, 0, 0, -2 / (zFar - zNear),
    0, tx, ty, tz, 1
  ]);
}

// glFrustum(left, right, bottom, top, zNear, zFar)
/**
 * creates a perspective matrix that produces a perspective projection
 * @param left coordinates for the vertical left clipping pane
 * @param right coordinates for the vertical right clipping pane
 * @param bottom coordinates for the horizontal bottom clipping pane
 * @param top coodinates for the top horizontal clipping pane
 * @param zNear Specify the distances to the near depth clipping plane. Must be positive.
 * @param zFar Specify the distances to the far depth clipping planes. Must be positive.
 * @returns 4x4 perspective projection matrix
 * @see https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glFrustum.xml
 */
export function frustum(
  left: number,
  right: number,
  bottom: number,
  top: number,
  zNear: number,
  zFar: number
): Mat {
  const t1 = 2 * zNear;
  const t2 = right - left;
  const t3 = top - bottom;
  const t4 = zFar - zNear;
  // prettier-ignore
  return new Mat([
    t1 / t2, 0, 0, 0,
    0, t1 / t3, 0, 0,
    (right + left) / t2, (top + bottom) / t3, (-zFar - zNear) / t4, -1,
    0, 0, (-t1*zFar) / t4, 0
  ]);
}

/**
 * creates a perspective projection matrix
 * @param fieldOfView Specifies the field of view angle, in degrees, in the y direction.
 * @param aspectRatio Specifies the aspect ratio that determines the field of view in the x direction. The aspect ratio is the ratio of x (width) to y (height).
 * @param zNear Specifies the distance from the viewer to the near clipping plane (always positive).
 * @param zFar Specifies the distance from the viewer to the far clipping plane (always positive).
 * @returns 4x4 perspective projection matrix
 */
export function perspective(
  fieldOfView: number,
  aspectRatio: number,
  zNear: number,
  zFar: number
) {
  const y = zNear * Math.tan((fieldOfView * Math.PI) / 360);
  const x = y * aspectRatio;
  return frustum(-x, x, -y, y, zNear, zFar);
}
