/**
 * Sample GeoJSON data for testing the geometry tool
 */

// Red polygon - Square in Paris area
export const sampleGeometry1 = {
  type: "Feature",
  properties: { name: "Red Square" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [2.32, 48.85],
        [2.34, 48.85],
        [2.34, 48.87],
        [2.32, 48.87],
        [2.32, 48.85]
      ]
    ]
  }
};

// Blue polygon - Overlapping square
export const sampleGeometry2 = {
  type: "Feature",
  properties: { name: "Blue Square" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [2.33, 48.86],
        [2.35, 48.86],
        [2.35, 48.88],
        [2.33, 48.88],
        [2.33, 48.86]
      ]
    ]
  }
};

// Green polygon - Circle approximation (octagon)
export const sampleGeometry3 = {
  type: "Feature",
  properties: { name: "Green Circle" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [2.30, 48.86],
        [2.305, 48.865],
        [2.31, 48.87],
        [2.31, 48.88],
        [2.305, 48.885],
        [2.30, 48.89],
        [2.295, 48.885],
        [2.29, 48.88],
        [2.29, 48.87],
        [2.295, 48.865],
        [2.30, 48.86]
      ]
    ]
  }
};

// Color palette for geometries
export const colorPalette = [
  '#ef4444', // red-500
  '#3b82f6', // blue-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
];

export const getRandomColor = () => {
  return colorPalette[Math.floor(Math.random() * colorPalette.length)];
};
