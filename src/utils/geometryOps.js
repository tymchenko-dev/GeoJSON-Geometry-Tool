import * as turf from '@turf/turf';

/**
 * Normalize GeoJSON to a Feature format that turf.js can work with
 * @param {Object} geojson - Any GeoJSON object
 * @returns {Object} - Normalized Feature object
 */
const normalizeToFeature = (geojson) => {
  if (!geojson) return null;
  
  // If it's already a Feature, return as-is
  if (geojson.type === 'Feature') {
    return geojson;
  }
  
  // If it's a FeatureCollection, extract the first feature or merge all
  if (geojson.type === 'FeatureCollection') {
    if (!geojson.features || geojson.features.length === 0) {
      throw new Error('FeatureCollection is empty');
    }
    // For union operations with FeatureCollection, we need to combine all features
    if (geojson.features.length === 1) {
      return geojson.features[0];
    }
    // Multiple features - union them together first
    let result = geojson.features[0];
    for (let i = 1; i < geojson.features.length; i++) {
      result = turf.union(result, geojson.features[i]);
    }
    return result;
  }
  
  // If it's a geometry type (Polygon, Point, etc.), wrap it in a Feature
  if (['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(geojson.type)) {
    return {
      type: 'Feature',
      properties: {},
      geometry: geojson
    };
  }
  
  throw new Error(`Unsupported GeoJSON type: ${geojson.type}`);
};

/**
 * Perform union operation on multiple geometries
 * @param {Array} geometries - Array of GeoJSON features
 * @returns {Object|null} - Union result or null if operation fails
 */
export const performUnion = (geometries) => {
  if (!geometries || geometries.length < 2) {
    throw new Error('Union requires at least 2 geometries');
  }

  try {
    // Normalize all geometries to Feature format
    const normalized = geometries.map(g => normalizeToFeature(g));
    
    // turf.js v7 requires FeatureCollection input
    const collection = turf.featureCollection(normalized);
    return turf.union(collection);
  } catch (error) {
    throw new Error(`Union operation failed: ${error.message}`);
  }
};

/**
 * Perform intersection operation on multiple geometries
 * @param {Array} geometries - Array of GeoJSON features
 * @returns {Object|null} - Intersection result or null if no intersection
 */
export const performIntersection = (geometries) => {
  if (!geometries || geometries.length < 2) {
    throw new Error('Intersection requires at least 2 geometries');
  }

  try {
    // Normalize all geometries to Feature format
    const normalized = geometries.map(g => normalizeToFeature(g));
    
    // turf.js v7 requires FeatureCollection input
    const collection = turf.featureCollection(normalized);
    return turf.intersect(collection);
  } catch (error) {
    throw new Error(`Intersection operation failed: ${error.message}`);
  }
};

/**
 * Perform subtraction (difference) operation
 * Subtracts all subsequent geometries from the first one
 * @param {Array} geometries - Array of GeoJSON features
 * @returns {Object|null} - Difference result or null if operation fails
 */
export const performSubtraction = (geometries) => {
  if (!geometries || geometries.length < 2) {
    throw new Error('Subtraction requires at least 2 geometries');
  }

  try {
    // Normalize all geometries to Feature format
    const normalized = geometries.map(g => normalizeToFeature(g));
    
    // turf.js v7 requires FeatureCollection input for difference
    const collection = turf.featureCollection(normalized);
    return turf.difference(collection);
  } catch (error) {
    throw new Error(`Subtraction operation failed: ${error.message}`);
  }
};

/**
 * Validate if a GeoJSON object is valid
 * @param {Object} geojson - GeoJSON object to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateGeoJSON = (geojson) => {
  if (!geojson) {
    return { valid: false, error: 'GeoJSON is null or undefined' };
  }

  if (typeof geojson !== 'object') {
    return { valid: false, error: 'GeoJSON must be an object' };
  }

  // Check for required properties
  if (!geojson.type) {
    return { valid: false, error: 'GeoJSON must have a "type" property' };
  }

  const validTypes = ['Feature', 'FeatureCollection', 'Point', 'LineString', 
                      'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'];
  
  if (!validTypes.includes(geojson.type)) {
    return { valid: false, error: `Invalid GeoJSON type: ${geojson.type}` };
  }

  // For Feature type, check geometry
  if (geojson.type === 'Feature' && !geojson.geometry) {
    return { valid: false, error: 'Feature must have a "geometry" property' };
  }

  // For FeatureCollection, check features array
  if (geojson.type === 'FeatureCollection') {
    if (!Array.isArray(geojson.features)) {
      return { valid: false, error: 'FeatureCollection must have a "features" array' };
    }
  }

  // Try to use turf to validate geometry
  try {
    if (geojson.type === 'Feature' && geojson.geometry) {
      // Check if geometry is valid by calculating area (will throw if invalid)
      turf.area(geojson);
    }
  } catch (error) {
    return { valid: false, error: `Invalid geometry: ${error.message}` };
  }

  return { valid: true, error: null };
};

/**
 * Calculate the bounding box of a GeoJSON object
 * @param {Object} geojson - GeoJSON feature or feature collection
 * @returns {Array|null} - Bounding box [minX, minY, maxX, maxY] or null
 */
export const getBoundingBox = (geojson) => {
  try {
    return turf.bbox(geojson);
  } catch (error) {
    return null;
  }
};

/**
 * Calculate the centroid of a GeoJSON object
 * @param {Object} geojson - GeoJSON feature
 * @returns {Object|null} - Centroid point feature or null
 */
export const getCentroid = (geojson) => {
  try {
    return turf.centroid(geojson);
  } catch (error) {
    return null;
  }
};
