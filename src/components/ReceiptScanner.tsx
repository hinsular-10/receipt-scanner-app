import { Camera, Upload, X } from "lucide-react";

function ReceiptScanner() {

    return (
        <section>
        <h2>Scan Receipt</h2>
        <div className="upload-area">
          <p>Drag and drop your receipt here</p>
          <input type="file" id="fileInput" accept="image/*" />
        </div>
        <p>Take a photo, upload an image or drag and drop your receipt here</p>
      </section>
    );
}

export default ReceiptScanner;