import { X } from 'lucide-react';
import { Button } from './ui/button';
import type { ReceiptData } from './ReceiptForm';

interface ReceiptDetailProps {
  receipt: ReceiptData;
  onClose: () => void;
}

export function ReceiptDetail({ receipt, onClose }: ReceiptDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold">Receipt Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-4">
          {receipt.imageData && (
            <img
              src={receipt.imageData}
              alt={`Receipt from ${receipt.storeName}`}
              className="mb-4 h-64 w-full rounded-md object-cover"
            />
          )}

          <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <div>
              <p className="font-medium text-gray-500">Store</p>
              <p>{receipt.storeName}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Category</p>
              <p>{receipt.category}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Date</p>
              <p>{new Date(receipt.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Total</p>
              <p className="text-lg font-semibold text-green-600">
                ${parseFloat(receipt.total || '0').toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-medium text-gray-500">Items</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm text-gray-700">
              {receipt.items || 'No item details captured.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
