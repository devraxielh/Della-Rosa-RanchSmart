import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Detection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
}

export default function CowCounterUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
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

      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
  }, [preview, detections]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
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
          url: "https://serverless.roboflow.com/contagem-de-vaca/2",
          params: { api_key: "GNSeL5vRbnVirJ2Dewwd" },
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

  return (
    <div className="p-1">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">🐄 Contador de Ganado</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 border dark:text-white" />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 text-white font-bold py-2 px-4 rounded ${
          loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Procesando..." : "Contar Animales"}
      </button>

      {loading && (
        <div className="mt-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <span className="ml-4 text-blue-700 font-medium">Detectando animales...</span>
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
        <div className="mt-6">
          <h3 className="font-semibold text-lg text-blue-800">
            ✅ Total de animales detectados: {detections.length}
          </h3>
        </div>
      )}
    </div>
  );
}
