import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup as RLFeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const API_URL = import.meta.env.VITE_API_URL+'potreros/';

const MapaPotreros = () => {
  const featureGroupRef = useRef(null);
  const [potreros, setPotreros] = useState([]);

  // 🔁 Función para cargar potreros desde el backend
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
          const layer = L.polygon(p.coordenadas, {
            color: 'green',
            fillColor: '#7CFC00',
            fillOpacity: 0.4
          });
          layer._leaflet_id = p._leaflet_id;
          layer.bindPopup(`<strong>${p.nombre}</strong><br/>Área: ${p.area_m2} m²`);
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

  // ✅ Crear potrero
  const handleCreate = async (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);

    const nombre = prompt("📝 Nombre del potrero:");
    if (!nombre) return;

    const nuevo = {
      nombre,
      coordenadas: latlngs,
      pasto: 1 // por defecto
    };

    try {
      await axios.post(API_URL, nuevo);
      console.log("✅ Potrero creado");
      await cargarPotreros(); // recarga todo el mapa
    } catch (err) {
      console.error("❌ Error al crear:", err);
    }
  };

  // ✅ Editar potrero
  const handleEdit = async (e) => {
    const layers = e.layers;
    const copia = [...potreros];

    layers.eachLayer(async (layer) => {
      const latlngs = layer.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);
      const layerId = layer._leaflet_id;
      const index = copia.findIndex(p => p._leaflet_id === layerId);

      if (index !== -1) {
        const actual = copia[index];
        const nuevoNombre = prompt("✏️ Edita el nombre del potrero:", actual.nombre) || actual.nombre;

        const actualizado = {
          ...actual,
          nombre: nuevoNombre,
          coordenadas: latlngs,
          pasto: actual.pasto
        };

        try {
          await axios.put(`${API_URL}${actual.id}/`, actualizado);
          console.log("✏️ Potrero actualizado:", actualizado);
          await cargarPotreros(); // recarga todo el mapa
        } catch (err) {
          console.error("❌ Error al actualizar:", err);
        }
      }
    });
  };

  // ✅ Eliminar potrero
  const handleDelete = async (e) => {
    const copia = [...potreros];
    const layers = e.layers;

    layers.eachLayer(async (layer) => {
      const layerId = layer._leaflet_id;
      const index = copia.findIndex(p => p._leaflet_id === layerId);

      if (index !== -1) {
        const potrero = copia[index];
        try {
          await axios.delete(`${API_URL}${potrero.id}/`);
          console.log("🗑️ Potrero eliminado:", potrero);
          await cargarPotreros(); // recarga todo el mapa
        } catch (err) {
          console.error("❌ Error al eliminar:", err);
        }
      }
    });
  };

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

        <RLFeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            draw={{
              rectangle: false,
              circle: false,
              marker: false,
              polyline: false,
              circlemarker: false
            }}
            onCreated={handleCreate}
            onEdited={handleEdit}
            onDeleted={handleDelete}
          />
        </RLFeatureGroup>
      </MapContainer>
    </div>
  );
};

export default MapaPotreros;