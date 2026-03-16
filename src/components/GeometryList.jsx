/**
 * Component for displaying and managing the list of geometries
 */
const GeometryList = ({
  geometries,
  selectedIds,
  onToggleSelection,
  onToggleVisibility,
  onRemove,
  onSelectAll,
  onDeselectAll,
  onClearAll,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Geometries ({geometries.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            All
          </button>
          <button
            onClick={onDeselectAll}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            None
          </button>
          <button
            onClick={onClearAll}
            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {geometries.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No geometries loaded. Add some using the form below.
        </p>
      ) : (
        <ul className="space-y-2 max-h-48 sm:max-h-56 lg:max-h-64 overflow-y-auto scroll-smooth">
          {geometries.map((geometry) => (
            <li
              key={geometry.id}
              className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                selectedIds.has(geometry.id)
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(geometry.id)}
                onChange={() => onToggleSelection(geometry.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              
              <div
                className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: geometry.color }}
              />
              
              <span className="flex-1 text-sm truncate text-gray-700">
                {geometry.name}
                {geometry.isResult && (
                  <span className="ml-1 text-xs text-purple-600">(result)</span>
                )}
              </span>
              
              <button
                onClick={() => onToggleVisibility(geometry.id)}
                className={`p-1 rounded transition-colors ${
                  geometry.visible
                    ? 'text-gray-600 hover:bg-gray-200'
                    : 'text-gray-400 hover:bg-gray-200'
                }`}
                title={geometry.visible ? 'Hide' : 'Show'}
              >
                {geometry.visible ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => onRemove(geometry.id)}
                className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Selected: {selectedIds.size} / {geometries.length}
      </div>
    </div>
  );
};

export default GeometryList;
