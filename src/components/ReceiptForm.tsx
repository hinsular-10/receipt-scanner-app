import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { createWorker } from 'tesseract.js';

export interface ReceiptData {
  id: string;
  storeName: string;
  date: string;
  total: string;
  category: string;
  items: string;
  imageData: string;
  createdAt: string;
}

interface ReceiptFormProps {
  imageData: string;
  onSave: (receipt: Omit<ReceiptData, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ReceiptForm({ imageData, onSave, onCancel }: ReceiptFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [formData, setFormData] = useState({
    storeName: '',
    date: new Date().toISOString().split('T')[0],
    total: '',
    category: 'General',
    items: '',
  });

  // Extract text from receipt using Tesseract.js
  useEffect(() => {
    const extractText = async () => {
      setIsProcessing(true);
      try {
        const worker = await createWorker('eng', 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          },
        });

        const { data: { text } } = await worker.recognize(imageData);
        await worker.terminate();

        // Parse extracted text to find total and items
        const lines = text.split('\n').filter(line => line.trim());
        
        // Try to find total amount (look for patterns like $XX.XX or TOTAL)
        let total = '';
        const totalPatterns = [
          /total[:\s]*\$?(\d+\.?\d*)/i,
          /amount[:\s]*\$?(\d+\.?\d*)/i,
          /\$(\d+\.\d{2})/,
        ];
        
        for (const line of lines) {
          for (const pattern of totalPatterns) {
            const match = line.match(pattern);
            if (match && match[1]) {
              const amount = parseFloat(match[1]);
              if (amount > 0 && amount < 10000) { // reasonable range
                total = match[1];
                break;
              }
            }
          }
          if (total) break;
        }

        // Try to extract store name (usually first few lines)
        const storeName = lines[0]?.trim() || '';

        // Extract items (lines that might be products)
        const itemLines = lines.filter(line => {
          const hasPrice = /\$?\d+\.\d{2}/.test(line);
          const notTotal = !/total|amount|subtotal|tax|change|payment/i.test(line);
          return hasPrice && notTotal && line.length > 3;
        });

        setFormData(prev => ({
          ...prev,
          storeName: storeName.substring(0, 50),
          total: total || prev.total,
          items: itemLines.join('\n'),
        }));
      } catch (error) {
        console.error('OCR error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    extractText();
  }, [imageData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      imageData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2>Review Receipt Details</h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="size-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Receipt Image Preview */}
            <div>
              <Label>Receipt Image</Label>
              <div className="mt-2 border rounded-lg overflow-hidden relative">
                <img
                  src={imageData}
                  alt="Receipt preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2">
                      <Loader2 className="size-6 animate-spin text-blue-600" />
                      <p className="text-sm">Extracting text... {ocrProgress}%</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {isProcessing 
                  ? 'Processing receipt with OCR...' 
                  : 'OCR extraction complete. Edit the details as needed.'}
              </p>
            </div>

            {/* Receipt Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  disabled={isProcessing}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isProcessing}
                  required
                />
              </div>

              <div>
                <Label htmlFor="total">Total Amount</Label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={handleChange}
                  disabled={isProcessing}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                  disabled={isProcessing}
                  required
                >
                  <option value="General">General</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Dining">Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="items">Items (Optional)</Label>
                <textarea
                  id="items"
                  name="items"
                  value={formData.items}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24 disabled:opacity-50"
                  placeholder="List items purchased..."
                  disabled={isProcessing}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Save Receipt'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}