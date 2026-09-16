import { X } from 'lucide-react';
import { Button } from './ui/button';
import type { ReceiptData } from './ReceiptForm';

interface ReceiptSummaryTableProps {
  selectedReceipts: ReceiptData[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function ReceiptSummaryTable({ selectedReceipts, onRemove, onClose }: ReceiptSummaryTableProps) {
  if (selectedReceipts.length === 0) return null;

  const totalAmount = selectedReceipts.reduce((sum, receipt) => 
    sum + parseFloat(receipt.total || '0'), 0
  );

  // Group by category
  const categoryTotals = selectedReceipts.reduce((acc, receipt) => {
    const amount = parseFloat(receipt.total || '0');
    acc[receipt.category] = (acc[receipt.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-40 max-h-96 overflow-hidden">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3>Selected Receipts Summary ({selectedReceipts.length})</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="text-left p-2">Store</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Category</th>
                <th className="text-right p-2">Amount</th>
                <th className="text-center p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedReceipts.map((receipt) => (
                <tr key={receipt.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{receipt.storeName}</td>
                  <td className="p-2">{new Date(receipt.date).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {receipt.category}
                    </span>
                  </td>
                  <td className="p-2 text-right text-green-600">
                    ${parseFloat(receipt.total).toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => onRemove(receipt.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td colSpan={3} className="p-2 text-right">Total:</td>
                <td className="p-2 text-right text-green-600 text-lg">
                  ${totalAmount.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Category Breakdown */}
        <div className="mt-4 flex flex-wrap gap-2">
          <p className="w-full text-sm font-medium text-gray-600">By Category:</p>
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              <span className="font-medium">{category}:</span>{' '}
              <span className="text-green-600">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
