import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Component to fit map bounds to all geometries
 */
const BoundsFitter = ({ geometries }) => {
  const map = useMap();
  
  useEffect(() => {
    if (geometries.length === 0) {
      map.setView([48.86, 2.35], 13);
      return;
    }

    const visibleGeoms = geometries.filter(g => g.visible);
    if (visibleGeoms.length === 0) return;

    const group = new L.FeatureGroup();
    visibleGeoms.forEach(geom => {
      const layer = L.geoJSON(geom.geojson);
      group.addLayer(layer);
    });

    const bounds = group.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [geometries, map]);

  return null;
};

/**
 * Map component for displaying GeoJSON geometries
 */
const MapView = ({ geometries }) => {
  const geoJsonRefs = useRef({});

  // Style function for GeoJSON layers
  const getStyle = (geometry) => {
    return {
      color: geometry.color,
      weight: 2,
      opacity: 0.8,
      fillColor: geometry.color,
      fillOpacity: 0.3,
    };
  };

  // Highlight style for selected geometries
  const getSelectedStyle = (geometry) => {
    return {
      color: geometry.color,
      weight: 4,
      opacity: 1,
      fillColor: geometry.color,
      fillOpacity: 0.5,
      dashArray: '5, 5',
    };
  };

  return (
    <MapContainer
      center={[48.86, 2.35]}
      zoom={13}
      scrollWheelZoom={true}
      touchZoom={true}
      doubleClickZoom={true}
      dragging={true}
      className="h-full w-full"
      tap={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <BoundsFitter geometries={geometries} />
      
      {geometries.map((geometry) => (
        geometry.visible && (
          <GeoJSON
            key={geometry.id}
            data={geometry.geojson}
            style={() => getStyle(geometry)}
            ref={(ref) => {
              if (ref) {
                geoJsonRefs.current[geometry.id] = ref;
              }
            }}
          />
        )
      ))}
    </MapContainer>
  );
};

export default MapView;
