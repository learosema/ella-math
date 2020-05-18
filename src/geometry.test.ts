import { Geometry } from './geometry';

describe('geometry for a cube', () => {
  const cube = Geometry.cube(1);

  it('should return a geometry object', () => {
    expect(cube).toBeInstanceOf(Geometry);
  });

  it('should have 8 vertices', () => {
    expect(cube.vertices).toHaveLength(8);
  });

  it('should have 12 faces', () => {
    expect(cube.faces).toHaveLength(12);
  });

  it('should have 12 face normals', () => {
    expect(cube.normals).toHaveLength(12);
  });
});

describe('geometry for a sphere', () => {
  const sphere = Geometry.sphere(10, 6, 6);
  it('should return a geometry object', () => {
    expect(sphere).toBeInstanceOf(Geometry);
  });

  it('should have 49 vertices', () => {
    expect(sphere.vertices).toHaveLength(49);
  });

  it('should have 60 faces', () => {
    expect(sphere.faces).toHaveLength(60);
  });

  it('should have 60 face normals', () => {
    expect(sphere.normals).toHaveLength(60);
  });
});

describe('geometry for a grid', () => {
  const grid = Geometry.grid(-10, -10, 20, 20, 3, 3);
  it('should return a geometry object', () => {
    expect(grid).toBeInstanceOf(Geometry);
  });

  it('should have 16 vertices', () => {
    expect(grid.vertices).toHaveLength(16);
  });

  it('should have 18 faces', () => {
    expect(grid.faces).toHaveLength(18);
  });

  it('should have 18 face normals', () => {
    expect(grid.normals).toHaveLength(18);
  });
});
