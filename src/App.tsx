import { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { ReceiptForm } from './components/ReceiptForm';
import type { ReceiptData } from './components/ReceiptForm';
import { ReceiptList } from './components/ReceiptList';
import { ReceiptSummaryTable } from './components/ReceiptSummaryTable';
import ReceiptScanner from './components/ReceiptScanner';
import { Button } from './components/ui/button';

const STORAGE_KEY = 'receipt-scanner-data';

export default function App() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);

  // Load receipts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setReceipts(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load receipts:', error);
      }
    }
  }, []);

  // Save receipts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  }, [receipts]);

  // Show/hide summary when selection changes
  useEffect(() => {
    setShowSummary(selectedIds.size > 0);
  }, [selectedIds]);

  const handleScan = (imageData: string) => {
    setCurrentImage(imageData);
    setShowScanner(false);
  };

  const handleSaveReceipt = (receiptData: Omit<ReceiptData, 'id' | 'createdAt'>) => {
    const newReceipt: ReceiptData = {
      ...receiptData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReceipts([newReceipt, ...receipts]);
    setCurrentImage(null);
  };

  const handleDeleteReceipt = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      setReceipts(receipts.filter((r) => r.id !== id));
      // Remove from selection if it was selected
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleCancel = () => {
    setCurrentImage(null);
    setShowScanner(false);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(receipts.map(r => r.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleRemoveFromSummary = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const selectedReceipts = receipts.filter(r => selectedIds.has(r.id));
  const shouldShowLandingScanner = !currentImage && (showScanner || receipts.length === 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Receipt className="size-6 text-white" />
              </div>
              <div>
                <h1>Receipt Scanner</h1>
                <p className="text-sm text-gray-600">Scan and save your receipts</p>
              </div>
            </div>
            {receipts.length > 0 && !showScanner && !currentImage && (
              <Button onClick={() => setShowScanner(true)}>
                Scan New Receipt
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {shouldShowLandingScanner ? (
          <div className="max-w-2xl mx-auto">
            <ReceiptScanner onScan={handleScan} />
            {receipts.length > 0 && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => setShowScanner(false)}>
                  View Saved Receipts
                </Button>
              </div>
            )}
          </div>
        ) : ( 
          <ReceiptList 
            receipts={receipts} 
            onDelete={handleDeleteReceipt}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />
        )}
      </main>

      {/* Receipt Form Modal */}
      {currentImage && (
        <ReceiptForm
          imageData={currentImage}
          onSave={handleSaveReceipt}
          onCancel={handleCancel}
        />
      )}

      {/* Summary Table */}
      {showSummary && (
        <ReceiptSummaryTable
          selectedReceipts={selectedReceipts}
          onRemove={handleRemoveFromSummary}
          onClose={() => setSelectedIds(new Set())}
        />
      )}
    </div>
  );
}