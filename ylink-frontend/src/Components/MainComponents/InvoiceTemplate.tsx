import React from 'react';

interface InvoiceProps {
    orderId: string;
    orderDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    items: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
    }>;
    paymentMethod: string;
}

export const InvoiceTemplate: React.FC<InvoiceProps> = ({ 
    orderId, 
    orderDate, 
    customerName, 
    customerEmail, 
    customerPhone, 
    shippingAddress,
    items,
    paymentMethod,
}) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat = subtotal * 0.075; // 7.5% Nigerian VAT standard
    const deliveryFee = 3500;
    const totalAmount = subtotal + vat + deliveryFee;

    return (
        <div id="printable-invoice" className="hidden print:block p-10 bg-white text-slate-900 font-sans text-sm">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">YLink Tech</h1>
                    <p className="text-xs text-slate-500 mt-1">Laptops, Smartphones & Solar Installations</p>
                    <p className="text-xs text-slate-500">27 Babalegba Street, Eleyele Ibadan, Nigeria</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-slate-700 uppercase tracking-wider">Official Invoice</h2>
                    <p className="text-xs font-mono mt-1 text-slate-600">ID: #{orderId}</p>
                    <p className="text-xs text-slate-500">Date: {orderDate}</p>
                </div>
            </div>

            {/* Customer Info Grid */}
            <div className="grid grid-cols-2 gap-8 my-8">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Billed To:</h3>
                    <p className="font-bold text-slate-800">{customerName}</p>
                    <p className="text-slate-600">{customerEmail}</p>
                    <p className="text-slate-600">{customerPhone}</p>
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Delivery Destination:</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{shippingAddress}</p>
                </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-left border-collapse my-6">
                <thead>
                    <tr className="border-b border-slate-300 text-xs font-bold uppercase text-slate-500 bg-slate-50">
                        <th className="py-3 px-2">Item Description</th>
                        <th className="py-3 px-2 text-center">Qty</th>
                        <th className="py-3 px-2 text-right">Unit Price</th>
                        <th className="py-3 px-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                        <tr key={item.id} className="text-slate-700">
                            <td className="py-3 px-2 font-medium text-slate-900">{item.name}</td>
                            <td className="py-3 px-2 text-center font-mono">{item.quantity}</td>
                            <td className="py-3 px-2 text-right font-mono">₦{item.price.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right font-mono font-semibold">₦{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Financial Summary Breakdowns */}
            <div className="flex justify-end mt-8">
                <div className="w-64 space-y-2 text-sm border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>VAT (7.5%):</span>
                        <span className="font-mono">₦{vat.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee:</span>
                        <span className="font-mono">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-dashed border-slate-200">
                        <span>Total Paid:</span>
                        <span className="font-mono">₦{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 text-right">
                        <span className="px-2.5 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider rounded">
                            Paid via {paymentMethod}
                        </span>
                    </div>
                </div>
            </div>

            {/* Invoice Footer */}
            <div className="mt-16 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
                <p>Thank you for partnering with YLink Tech!</p>
                <p className="mt-1">For hardware warranty verification or solar service inquiries, retain this document receipt safely.</p>
            </div>
        </div>
    );
};