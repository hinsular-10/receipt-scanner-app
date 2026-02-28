import { Camera, Upload, X } from "lucide-react";
import { useState, useRef } from "react";

const showCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
       video: true },
      audio: false
    });
  
  }


function ReceiptScanner() {

    return (
        // Upload File
        <>
       
        <section>
          <h2>Scan Receipt</h2>
          <div className="upload-area">
            <p>Drag and drop your receipt here</p>
            <input type="file" id="fileInput" accept="image/*" />
          </div>

          {/* Camera */}
          
          <button onClick={showCamera}>
            Take a Photo
          </button>
         

        </section>
          <p>Take a photo, upload an image or drag and drop your receipt here</p>
        
        </>

    );
}

export default ReceiptScanner;