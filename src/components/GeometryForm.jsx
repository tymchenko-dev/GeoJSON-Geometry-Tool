import { useState } from 'react';
import { validateGeoJSON } from '../utils/geometryOps';

/**
 * Form component for adding new GeoJSON geometries
 */
const GeometryForm = ({ onAddGeometry }) => {
  const [geoJsonText, setGeoJsonText] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!geoJsonText.trim()) {
      setError('Please enter GeoJSON data');
      return;
    }

    try {
      const parsed = JSON.parse(geoJsonText);
      
      // Validate GeoJSON
      const validation = validateGeoJSON(parsed);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      // Add the geometry
      onAddGeometry(parsed, name.trim() || undefined);
      
      // Clear form
      setGeoJsonText('');
      setName('');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON syntax: ' + err.message);
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  const loadSample = () => {
    const sample = {
      type: "Feature",
      properties: { name: "Sample Polygon" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2.30, 48.85],
            [2.32, 48.85],
            [2.32, 48.87],
            [2.30, 48.87],
            [2.30, 48.85]
          ]
        ]
      }
    };
    setGeoJsonText(JSON.stringify(sample, null, 2));
    setName('Sample Polygon');
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add Geometry</h2>
        <button
          onClick={loadSample}
          className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
        >
          Load Sample
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Geometry name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GeoJSON
          </label>
          <textarea
            value={geoJsonText}
            onChange={(e) => setGeoJsonText(e.target.value)}
            placeholder={`Paste GeoJSON here, e.g.:
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [...]
  }
}`}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs resize-y min-h-[120px]"
          />
        </div>

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Add Geometry
        </button>
      </form>

      <div className="mt-3 text-xs text-gray-500">
        <p>Supported types: Feature, FeatureCollection, Polygon, etc.</p>
      </div>
    </div>
  );
};

export default GeometryForm;
