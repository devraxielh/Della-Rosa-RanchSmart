import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup as RLFeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL + 'potreros/';

const MapaPotreros = () => {
  const featureGroupRef = useRef(null);
  const [potreros, setPotreros] = useState([]);

  // Función para traducir estado numérico a texto
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
          // Color por estado
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

  return (
    <div className="h-[70vh] w-full">
      <MapContainer
        center={[8.6559, -75.9001]}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full rounded shadow"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RLFeatureGroup ref={featureGroupRef} />
      </MapContainer>
    </div>
  );
};

export default MapaPotreros;