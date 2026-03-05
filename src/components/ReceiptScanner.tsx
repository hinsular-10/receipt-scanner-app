import { useRef, useState } from "react";

interface ReceiptScannerProps {
  onScan: (imageData: string) => void;
}

function ReceiptScanner({ onScan }: ReceiptScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // function to show camera and get media stream
  const startCamera = async () => {
    try {
      // Request access to the camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
         video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);

      const videoElement = document.querySelector('#video') as HTMLVideoElement;

      if (videoElement) {
        videoElement.srcObject = mediaStream;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please allow camera permissions and try again.");
    }
  };

  // function to stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
      setShowCamera(false);

  };

  // function to capture photo from video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        stopCamera();
        onScan(imageData);
      }
    }
  };

  // function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onScan(imageData);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  //function to handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please drop an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Process the dropped file
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      onScan(imageData);
    };
    reader.onerror = () => {
      alert('Error reading dropped file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  if (showCamera) {
    return (
      <div>
        <video ref={videoRef} autoPlay playsInline id="video" className="w-full h-auto" />
        <button onClick={capturePhoto}>Capture Photo</button>
        <button onClick={stopCamera}>Cancel</button>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <>
      <section>
        <h2>Scan Receipt</h2>
        <div
          className={`upload-area border-4 border-dashed rounded-lg p-16 min-h-[200px] text-center transition-colors flex flex-col justify-center items-center ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className={isDragOver ? 'text-blue-600 dark:text-blue-400' : ''}>
            {isDragOver ? 'Drop your receipt here!' : 'Drag and drop your receipt here'}
          </p>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-4"
          />
        </div>

        {/* Camera */}
        <button onClick={startCamera}>
          Take a Photo
        </button>

      </section>
      <p>Take a photo, upload an image or drag and drop your receipt here</p>
    </>
  );
}

export default ReceiptScanner;