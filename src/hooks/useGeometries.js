import { useState, useCallback } from 'react';
import { getRandomColor } from '../utils/sampleData';

/**
 * Custom hook for managing geometry state
 */
export const useGeometries = (initialGeometries = []) => {
  const [geometries, setGeometries] = useState(initialGeometries);
  const [selectedIds, setSelectedIds] = useState(new Set());

  /**
   * Add a new geometry
   * @param {Object} geojson - GeoJSON feature
   * @param {string} name - Name for the geometry
   */
  const addGeometry = useCallback((geojson, name) => {
    const newGeometry = {
      id: Date.now().toString(),
      name: name || `Geometry ${geometries.length + 1}`,
      geojson,
      color: getRandomColor(),
      visible: true,
      isResult: false,
    };
    setGeometries(prev => [...prev, newGeometry]);
    return newGeometry.id;
  }, [geometries.length]);

  /**
   * Remove a geometry by ID
   * @param {string} id - Geometry ID
   */
  const removeGeometry = useCallback((id) => {
    setGeometries(prev => prev.filter(g => g.id !== id));
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  /**
   * Toggle geometry visibility
   * @param {string} id - Geometry ID
   */
  const toggleVisibility = useCallback((id) => {
    setGeometries(prev => prev.map(g => 
      g.id === id ? { ...g, visible: !g.visible } : g
    ));
  }, []);

  /**
   * Toggle geometry selection
   * @param {string} id - Geometry ID
   */
  const toggleSelection = useCallback((id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  /**
   * Select all geometries
   */
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(geometries.map(g => g.id)));
  }, [geometries]);

  /**
   * Deselect all geometries
   */
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  /**
   * Clear all geometries
   */
  const clearAll = useCallback(() => {
    setGeometries([]);
    setSelectedIds(new Set());
  }, []);

  /**
   * Add a result geometry from an operation
   * @param {Object} geojson - Result GeoJSON feature
   * @param {string} operationName - Name of the operation performed
   */
  const addResultGeometry = useCallback((geojson, operationName) => {
    const newGeometry = {
      id: Date.now().toString(),
      name: `Result: ${operationName}`,
      geojson,
      color: getRandomColor(),
      visible: true,
      isResult: true,
    };
    setGeometries(prev => [...prev, newGeometry]);
    // Auto-select the result
    setSelectedIds(new Set([newGeometry.id]));
    return newGeometry.id;
  }, []);

  /**
   * Get selected geometries as array
   */
  const getSelectedGeometries = useCallback(() => {
    return geometries.filter(g => selectedIds.has(g.id));
  }, [geometries, selectedIds]);

  /**
   * Get visible geometries as array
   */
  const getVisibleGeometries = useCallback(() => {
    return geometries.filter(g => g.visible);
  }, [geometries]);

  return {
    geometries,
    selectedIds,
    addGeometry,
    removeGeometry,
    toggleVisibility,
    toggleSelection,
    selectAll,
    deselectAll,
    clearAll,
    addResultGeometry,
    getSelectedGeometries,
    getVisibleGeometries,
  };
};
