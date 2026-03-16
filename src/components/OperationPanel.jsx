import { useState } from 'react';
import { performUnion, performIntersection, performSubtraction } from '../utils/geometryOps';

/**
 * Panel for performing geometric operations
 */
const OperationPanel = ({ selectedGeometries, onAddResult }) => {
  const [operation, setOperation] = useState('union');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const handleOperation = async () => {
    if (selectedGeometries.length < 2) {
      setLastError('Please select at least 2 geometries');
      return;
    }

    setIsProcessing(true);
    setLastError(null);
    setLastResult(null);

    try {
      let result;
      const geojsons = selectedGeometries.map(g => g.geojson);

      switch (operation) {
        case 'union':
          result = performUnion(geojsons);
          break;
        case 'intersection':
          result = performIntersection(geojsons);
          break;
        case 'subtraction':
          result = performSubtraction(geojsons);
          break;
        default:
          throw new Error('Unknown operation');
      }

      if (!result) {
        setLastError('Operation resulted in an empty geometry');
        setIsProcessing(false);
        return;
      }

      // Add properties to result
      result.properties = {
        ...result.properties,
        operation,
        sourceGeometries: selectedGeometries.map(g => g.name),
        createdAt: new Date().toISOString(),
      };

      onAddResult(result, operation.charAt(0).toUpperCase() + operation.slice(1));
      setLastResult(`Operation completed successfully!`);
    } catch (error) {
      setLastError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const operations = [
    {
      value: 'union',
      label: 'Union',
      description: 'Combine all selected geometries into one',
      icon: '∪',
    },
    {
      value: 'intersection',
      label: 'Intersection',
      description: 'Find the overlapping area of all geometries',
      icon: '∩',
    },
    {
      value: 'subtraction',
      label: 'Subtraction',
      description: 'Subtract subsequent geometries from the first',
      icon: '−',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Operations
      </h2>

      <div className="space-y-2 mb-4">
        {operations.map((op) => (
          <label
            key={op.value}
            className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors touch-manipulation ${
              operation === op.value
                ? 'bg-blue-50 border-blue-300'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="operation"
              value={op.value}
              checked={operation === op.value}
              onChange={(e) => setOperation(e.target.value)}
              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg flex-shrink-0">{op.icon}</span>
                <span className="font-medium text-gray-800 text-sm sm:text-base">{op.label}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">{op.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
        <p className="text-gray-600">
          Selected: <span className="font-semibold">{selectedGeometries.length}</span> geometries
        </p>
        {selectedGeometries.length > 0 && (
          <ul className="mt-1 text-xs text-gray-500">
            {selectedGeometries.map((g, i) => (
              <li key={g.id} className="truncate">
                {i === 0 ? '①' : ` ${i + 1}`} {g.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleOperation}
        disabled={isProcessing || selectedGeometries.length < 2}
        className={`w-full px-4 py-2 font-medium rounded-md transition-colors ${
          isProcessing || selectedGeometries.length < 2
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Execute Operation'}
      </button>

      {lastError && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {lastError}
        </div>
      )}

      {lastResult && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-600">
          {lastResult}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>Tip: Select multiple geometries from the list above, then choose an operation.</p>
      </div>
    </div>
  );
};

export default OperationPanel;
