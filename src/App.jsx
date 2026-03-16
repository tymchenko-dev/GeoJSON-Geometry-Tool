import { useMemo, useState, useEffect } from 'react';
import { useGeometries } from './hooks/useGeometries';
import MapView from './components/MapView';
import GeometryList from './components/GeometryList';
import GeometryForm from './components/GeometryForm';
import OperationPanel from './components/OperationPanel';
import { sampleGeometry1, sampleGeometry2, sampleGeometry3 } from './utils/sampleData';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize with sample data
  const initialGeometries = useMemo(() => [
    {
      id: 'sample-1',
      name: 'Red Square',
      geojson: sampleGeometry1,
      color: '#ef4444',
      visible: true,
      isResult: false,
    },
    {
      id: 'sample-2',
      name: 'Blue Square',
      geojson: sampleGeometry2,
      color: '#3b82f6',
      visible: true,
      isResult: false,
    },
    {
      id: 'sample-3',
      name: 'Green Circle',
      geojson: sampleGeometry3,
      color: '#22c55e',
      visible: true,
      isResult: false,
    },
  ], []);

  const {
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
  } = useGeometries(initialGeometries);

  const selectedGeometries = getSelectedGeometries();
  const visibleGeometries = getVisibleGeometries();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[1100] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800 truncate">
          GeoJSON Geometry Tool
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-[1000]
          w-80 max-w-[85vw] bg-gray-50 border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto scroll-smooth
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isMobile ? 'top-14' : ''}
        `}
      >
        <div className="p-4 space-y-4 pt-16 lg:pt-4">
          {/* Desktop Header */}
          <div className="hidden lg:block border-b border-gray-200 pb-4">
            <h1 className="text-xl font-bold text-gray-800">
              GeoJSON Geometry Tool
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Visualize and manipulate geographic geometries
            </p>
          </div>

          {/* Geometry List */}
          <GeometryList
            geometries={geometries}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onToggleVisibility={toggleVisibility}
            onRemove={removeGeometry}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onClearAll={clearAll}
          />

          {/* Operation Panel */}
          <OperationPanel
            selectedGeometries={selectedGeometries}
            onAddResult={addResultGeometry}
          />

          {/* Add Geometry Form */}
          <GeometryForm onAddGeometry={addGeometry} />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[900] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Map Area */}
      <div className="flex-1 relative pt-14 lg:pt-0">
        <MapView geometries={visibleGeometries} />
        
        {/* Legend overlay - Responsive positioning */}
        <div className="
          absolute bottom-4 right-4 
          bg-white rounded-lg shadow-lg p-3 z-[1000]
          max-w-[200px] sm:max-w-[250px]
          max-h-[40vh] overflow-y-auto
        ">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Legend</h3>
          <ul className="space-y-1 text-xs">
            {visibleGeometries.slice(0, 5).map((geom) => (
              <li key={geom.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded flex-shrink-0"
                  style={{ backgroundColor: geom.color }}
                />
                <span className="text-gray-600 truncate">
                  {geom.name}
                </span>
              </li>
            ))}
            {visibleGeometries.length > 5 && (
              <li className="text-gray-400 italic">
                +{visibleGeometries.length - 5} more
              </li>
            )}
          </ul>
        </div>

        {/* Mobile selected count indicator */}
        {isMobile && selectedIds.size > 0 && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-[1000]">
            {selectedIds.size} selected
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
