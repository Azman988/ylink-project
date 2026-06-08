import { BiCard } from "react-icons/bi";

interface paymentMethodProps {
    paymentMethod: string,
    setPaymentMethod: React.Dispatch<React.SetStateAction<string>>
}

const PaymentMethod = ({ paymentMethod, setPaymentMethod }: paymentMethodProps) => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-blue-500"><BiCard /></span> Payment Method
            </h2>

            <div className="space-y-4">
                {/* Paystack Option */}
                <label className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'paystack' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <input type="radio" name="payment" value="paystack" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                    <div className="ml-4 flex flex-col">
                        <span className="font-bold text-gray-900">Paystack Secure Payment</span>
                        <span className="text-sm text-gray-600">Pay securely via Card, USSD, or Bank Transfer.</span>
                    </div>
                </label>

                {/* POD Option */}
                <label className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'pod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <input type="radio" name="payment" value="pod" checked={paymentMethod === 'pod'} onChange={() => setPaymentMethod('pod')} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                    <div className="ml-4 flex flex-col">
                        <span className="font-bold text-gray-900">Pay on Delivery</span>
                        <span className="text-sm text-gray-600">Pay with cash or POS when your order arrives.</span>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default PaymentMethod;