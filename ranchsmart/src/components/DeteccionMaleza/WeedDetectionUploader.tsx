import { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as exifr from "exifr";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Detection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
}

interface GPSPosition {
  latitude: number;
  longitude: number;
}

export default function WeedDetectionUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [gps, setGps] = useState<GPSPosition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current || detections.length === 0) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderedWidth = img.clientWidth;
    const renderedHeight = img.clientHeight;
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    canvas.width = renderedWidth;
    canvas.height = renderedHeight;

    const scaleX = renderedWidth / originalWidth;
    const scaleY = renderedHeight / originalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(det => {
      const x = det.x * scaleX - (det.width * scaleX) / 2;
      const y = det.y * scaleY - (det.height * scaleY) / 2;
      const width = det.width * scaleX;
      const height = det.height * scaleY;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
  }, [preview, detections]);

  const extractGPS = async (file: File) => {
    const metadata = await exifr.gps(file);
    if (metadata && metadata.latitude && metadata.longitude) {
      setGps({ latitude: metadata.latitude, longitude: metadata.longitude });
    } else {
      setGps(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      extractGPS(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setGps(null);
    }

    setDetections([]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];

      try {
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/weeddetectiontesis/1",
          params: { api_key: "JNXk9wJKh4JSovgN3hdU" },
          data: base64String,
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const detectionsFormatted: Detection[] = response.data.predictions.map((p: any) => ({
          x: p.x,
          y: p.y,
          width: p.width,
          height: p.height,
          confidence: p.confidence,
          class: p.class
        }));

        setDetections(detectionsFormatted);
      } catch (error: any) {
        console.error("❌ Error al detectar:", error.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const renderCrops = () => {
    const img = imageRef.current;
    if (!img || detections.length === 0) return null;

    return detections.map((det, idx) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      canvas.width = det.width;
      canvas.height = det.height;

      ctx.drawImage(
        img,
        det.x - det.width / 2,
        det.y - det.height / 2,
        det.width,
        det.height,
        0,
        0,
        det.width,
        det.height
      );

      return (
        <div key={idx} className="inline-block m-2 border rounded shadow">
          <img src={canvas.toDataURL()} alt={`recorte-${idx}`} />
          <p className="text-xs text-center p-1">W: {det.width}px, H: {det.height}px</p>
        </div>
      );
    });
  };

  return (
    <div className="p-1">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">🌿Detección de Malezas</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 border dark:text-white" />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 text-white font-bold py-2 px-4 rounded ${
          loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Procesando..." : "Detectar Maleza"}
      </button>
      {loading && (
        <div className="mt-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
          <span className="ml-4 text-green-700 font-medium">Procesando imagen...</span>
        </div>
      )}
      {preview && (
        <div className="relative inline-block">
          <img
            ref={imageRef}
            src={preview}
            alt="Vista previa"
            className="max-w-full border rounded"
            onLoad={() => setDetections([...detections])}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            style={{ pointerEvents: "none", width: "100%", height: "100%" }}
          />
        </div>
      )}

      {!loading && detections.length > 0 && (
        <>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Recortes:</h3>
            <div className="flex flex-wrap">{renderCrops()}</div>
          </div>
        </>
      )}

      {!loading && gps && detections.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Ubicación GPS:</h3>
          <MapContainer
            center={[gps.latitude, gps.longitude]}
            zoom={17}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker
              position={[gps.latitude, gps.longitude]}
              icon={L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                Imagen con coordenadas:<br />
                Lat: {gps.latitude}, Lng: {gps.longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}
