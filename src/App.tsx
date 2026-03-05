// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import ReceiptScanner from './components/ReceiptScanner';

// Homepage

function App() {
  const handleScan = (imageData: string) => {
    console.log('Scanned receipt:', imageData);
    // TODO: Process the scanned receipt image
  };

  return (
    <>
    {/* Main */}
    <main className="max-w-7xl mx-auto px-4 py-8">
      <ReceiptScanner onScan={handleScan} />
    </main>
      <footer>
        <p>&copy; 2026 Receipt Keeper</p>
      </footer>


    </>
  )
}

export default App
