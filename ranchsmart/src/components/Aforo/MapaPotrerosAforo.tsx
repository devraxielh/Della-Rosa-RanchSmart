import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup as RLFeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import GraficaAforosPorPotrero from './GraficaAforosPorPotrero';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const API_URL = import.meta.env.VITE_API_URL + 'potreros/';
const AFOROS_URL = import.meta.env.VITE_API_URL + 'aforos/';

const ResetViewButton = ({ center, zoom, onReset }: { center: [number, number]; zoom: number; onReset: () => void }) => {
  const map = useMap();
  const handleClick = () => {
    map.setView(center, zoom);
    onReset();
  };
  return (
    <button
      onClick={handleClick}
      className="absolute top-4 right-4 z-[9999] bg-white text-sm px-3 py-1 rounded shadow hover:bg-gray-100"
    >
      Restablecer vista
    </button>
  );
};

const MapaPotreros = () => {
  const featureGroupRef = useRef(null);
  const [potreros, setPotreros] = useState([]);
  const [potreroActivo, setPotreroActivo] = useState(null);
  const [aforos, setAforos] = useState([]);

  const cargarDatos = async () => {
    try {
      const [resPotreros, resAforos] = await Promise.all([
        axios.get(API_URL),
        axios.get(AFOROS_URL)
      ]);

      const aforosAgrupados = resAforos.data.reduce((acc, curr) => {
        const key = `${curr.potrero}-${curr.fecha}`;
        if (!acc[key]) {
          acc[key] = { ...curr };
        } else {
          acc[key].materia_seca_kg_ha += curr.materia_seca_kg_ha;
        }
        return acc;
      }, {});

      const aforosSumados = Object.values(aforosAgrupados);
      setAforos(aforosSumados);

      const data = resPotreros.data.map(p => {
        const aforosPotrero = aforosSumados
          .filter(a => a.potrero === p.id)
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        const ultimo = aforosPotrero[0];
        const materia = ultimo?.materia_seca_kg_ha || 0;

        return {
          ...p,
          _leaflet_id: Math.random().toString(36).substr(2, 9),
          materia_seca_kg_ha: materia,
          fecha_aforo: ultimo?.fecha || null
        };
      });

      setPotreros(data);

      const group = featureGroupRef.current;
      if (group && group._layers) {
        group.clearLayers();

        data.forEach(p => {
          const colorScale = p.materia_seca_kg_ha >= 6000
            ? '#00441b'
            : p.materia_seca_kg_ha >= 5000
            ? '#006d2c'
            : p.materia_seca_kg_ha >= 4000
            ? '#238b45'
            : p.materia_seca_kg_ha >= 3000
            ? '#41ab5d'
            : p.materia_seca_kg_ha >= 2000
            ? '#74c476'
            : p.materia_seca_kg_ha >= 1000
            ? '#bae4b3'
            : '#f03b20';

          const layer = L.polygon(p.coordenadas, {
            color: 'black',
            fillColor: colorScale,
            fillOpacity: 0.7
          });
          layer._leaflet_id = p._leaflet_id;
          layer.on('click', () => setPotreroActivo(p));
          layer.bindPopup(`
            <strong>${p.nombre}</strong><br/>
            Área: ${p.area_m2} m²<br/>
            Último aforo: ${p.fecha_aforo || '—'}<br/>
            Materia seca: ${p.materia_seca_kg_ha ?? '—'} kg/ha
          `);
          group.addLayer(layer);
        });
      }
    } catch (err) {
      console.error('❌ Error cargando potreros o aforos:', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const defaultCenter = [8.6559, -75.9001];
  const defaultZoom = 13;

  return (
    <div className="space-y-6 relative">
      <div className="h-[30vh] w-full relative">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom
          className="h-full w-full rounded shadow"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RLFeatureGroup ref={featureGroupRef} />

          <ResetViewButton center={defaultCenter} zoom={defaultZoom} onReset={() => setPotreroActivo(null)} />
        </MapContainer>
      </div>

      {potreroActivo && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Histórico de aforos: {potreroActivo.nombre}
          </h3>
          <GraficaAforosPorPotrero potreroId={potreroActivo.id} />
        </div>
      )}
    </div>
  );
};

export default MapaPotreros;