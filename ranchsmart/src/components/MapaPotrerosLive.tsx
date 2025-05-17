import { useEffect, useState, useRef, useState as useReactState } from 'react';
import { MapContainer, TileLayer, FeatureGroup as RLFeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL + 'potreros/';

const ResetViewButton = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView(center, zoom)}
      className="absolute top-4 right-4 z-[9999] bg-white text-sm px-3 py-1 rounded shadow hover:bg-gray-100"
    >
      Restablecer mapa
    </button>
  );
};

const ResizeMapOnFullscreen = ({ fullscreen }: { fullscreen: boolean }) => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [fullscreen]);
  return null;
};

const MapaPotreros = () => {
  const featureGroupRef = useRef(null);
  const [potreros, setPotreros] = useState([]);
  const [fullscreen, setFullscreen] = useReactState(false);

  const estadoTexto = (estado) => {
    switch (parseInt(estado)) {
      case 1: return 'En descanso';
      case 2: return 'Ocupado';
      default: return 'Inactivo';
    }
  };

  const cargarPotreros = async () => {
    try {
      const res = await axios.get(API_URL);
      const data = res.data.map(p => ({
        ...p,
        _leaflet_id: Math.random().toString(36).substr(2, 9)
      }));
      setPotreros(data);

      const group = featureGroupRef.current;
      if (group && group._layers) {
        group.clearLayers();

        data.forEach(p => {
          let color = 'white';
          let fillColor = 'white';

          if (parseInt(p.estado) === 2) {
            color = 'red';
            fillColor = 'red';
          } else if (parseInt(p.estado) === 1) {
            color = 'green';
            fillColor = '#7CFC00';
          }

          const layer = L.polygon(p.coordenadas, {
            color,
            fillColor,
            fillOpacity: 0.4
          });

          layer._leaflet_id = p._leaflet_id;

          layer.bindPopup(`
            <strong>${p.nombre}</strong><br/>
            Estado: ${estadoTexto(p.estado)}<br/>
            Área: ${p.area_m2} m²
          `);

          group.addLayer(layer);
        });
      }
    } catch (err) {
      console.error("❌ Error cargando potreros:", err);
    }
  };

  useEffect(() => {
    cargarPotreros();
  }, []);

  const defaultCenter = [8.6559, -75.9001];
  const defaultZoom = 14;

  return (
    <div className={`relative w-full ${fullscreen ? 'h-[70vh]' : 'h-[30vh]'}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom
        zoomControl={false} // ❌ Oculta botones de zoom
        className="h-full w-full rounded shadow"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RLFeatureGroup ref={featureGroupRef} />
        <ResetViewButton center={defaultCenter} zoom={defaultZoom} />
        <ResizeMapOnFullscreen fullscreen={fullscreen} />
      </MapContainer>

      <button
        onClick={() => setFullscreen(!fullscreen)}
        className="absolute bottom-4 left-4 z-[9999] bg-white text-sm px-3 py-1 rounded shadow hover:bg-gray-100"
      >
        {fullscreen ? 'Minimizar' : 'Pantalla completa'}
      </button>
    </div>
  );
};

export default MapaPotreros;