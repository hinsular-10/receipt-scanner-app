import { useState } from 'react';
import { Trash2, Eye, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { ReceiptData } from './ReceiptForm';
import { ReceiptDetail } from './ReceiptDetail';

interface ReceiptListProps {
  receipts: ReceiptData[];
  onDelete: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function ReceiptList({ 
  receipts, 
  onDelete, 
  selectedIds, 
  onToggleSelect, 
  onSelectAll, 
  onClearSelection 
}: ReceiptListProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  if (receipts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No receipts saved yet. Start by scanning your first receipt!</p>
      </div>
    );
  }

  const totalAmount = receipts.reduce((sum, receipt) => sum + parseFloat(receipt.total || '0'), 0);

  return (
    <>
      <div className="mb-6">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Receipts</p>
              <p className="text-2xl">{receipts.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Selection Controls */}
      <div className="mb-4 flex gap-2 items-center">
        <Button variant="outline" size="sm" onClick={onSelectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Clear Selection
        </Button>
        {selectedIds.size > 0 && (
          <p className="text-sm text-gray-600">
            {selectedIds.size} receipt{selectedIds.size !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {receipts.map((receipt) => (
          <Card 
            key={receipt.id} 
            className={`overflow-hidden hover:shadow-lg transition-shadow ${
              selectedIds.has(receipt.id) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="h-40 bg-gray-100 overflow-hidden relative">
              <img
                src={receipt.imageData}
                alt={`Receipt from ${receipt.storeName}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(receipt.id)}
                  onChange={() => onToggleSelect(receipt.id)}
                  className="size-5 cursor-pointer"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="line-clamp-1">{receipt.storeName}</h3>
                  <p className="text-sm text-gray-500">{receipt.category}</p>
                </div>
                <p className="text-green-600">${parseFloat(receipt.total).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="size-4" />
                <span>{new Date(receipt.date).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedReceipt(receipt)}
                >
                  <Eye className="size-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(receipt.id)}
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedReceipt && (
        <ReceiptDetail
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </>
  );
}