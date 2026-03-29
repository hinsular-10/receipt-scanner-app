import { useState, useEffect } from "react";

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
    onSubmit: (data: { title: string; amount: number; date: string }) => void;
}

return (
    <div className="receipt-form">
        <h2>Receipt Details</h2>
        <form
)