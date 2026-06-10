import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Check, Loader2 } from 'lucide-react';
import type { Event } from '../types';

interface CheckoutModalProps {
  event: Event;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  event,
  onClose,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('bhavitha@okaxis');
  const [cardNumber, setCardNumber] = useState('4321 8765 0987 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('999');
  const [isProcessing, setIsProcessing] = useState(false);

  const basePrice = event.ticketPrice;
  const adminCommission = Math.round(basePrice * 0.05); // 5% Admin Fee
  const totalAmount = basePrice + adminCommission;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network delay
    setTimeout(() => {
      setIsProcessing(false);
      const randomId = `pay_mock_${Math.random().toString(36).substring(2, 11)}`;
      onSuccess(randomId);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl animate-scale-up"
        style={{
          background: '#0d0d0d',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Top Header Branding */}
        <div
          className="relative flex items-center justify-between p-4 bg-gradient-to-r text-black font-semibold"
          style={{
            background: 'linear-gradient(135deg, #00ff9d 0%, #00e5ff 100%)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <div>
            <h3 className="text-sm uppercase tracking-wider opacity-80">TechEvent Checkout</h3>
            <p className="text-xs font-normal opacity-90 truncate max-w-[280px]">
              {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-full hover:bg-black/10 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
          {/* Order Details Breakdown */}
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-2">
              Payment Breakdown
            </h4>
            <div className="flex justify-between text-neutral-300">
              <span>Workshop Fee</span>
              <span>₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Platform Fee (5% Admin)</span>
              <span>₹{adminCommission}</span>
            </div>
            <div className="h-[1px] bg-neutral-800 my-2" />
            <div className="flex justify-between text-sm font-bold text-white">
              <span>Total Amount</span>
              <span className="text-[#00ff9d]">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                paymentMethod === 'upi'
                  ? 'border-[#00ff9d] bg-[#00ff9d]/5 text-[#00ff9d]'
                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-400'
              }`}
            >
              <Smartphone size={15} />
              UPI (GPay / PhonePe)
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                paymentMethod === 'card'
                  ? 'border-[#00ff9d] bg-[#00ff9d]/5 text-[#00ff9d]'
                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-400'
              }`}
            >
              <CreditCard size={15} />
              Credit/Debit Card
            </button>
          </div>

          {/* Form Inputs */}
          {paymentMethod === 'upi' ? (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">
                Enter UPI ID
              </label>
              <input
                type="text"
                required
                disabled={isProcessing}
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
              />
              <span className="text-[10px] text-neutral-500">
                A collect request will be sent to this UPI ID
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  disabled={isProcessing}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400 uppercase">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400 uppercase">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    required
                    disabled={isProcessing}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-[#00ff9d] to-[#00e5ff] text-black font-bold text-sm shadow-lg hover:shadow-[#00ff9d]/20 transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Check size={16} />
                Pay ₹{totalAmount}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-900 text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1">
          🔒 Secured by Razorpay Mock Sandbox · INR
        </div>
      </div>
    </div>
  );
};
