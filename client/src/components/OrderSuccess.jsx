import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, ArrowLeft, Receipt } from 'lucide-react';
import { api } from '../services/api';

export default function OrderSuccess({ onBackToHome }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('polling'); // 'polling' | 'paid' | 'pending' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order_id');
  const sessionId = urlParams.get('session_id');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setErrorMessage('No order identification provided in payment callback.');
      return;
    }

    let isSubscribed = true;
    let pollCount = 0;
    const maxPolls = 10; // 10 attempts * 2 seconds = 20 seconds polling

    async function pollOrderStatus() {
      try {
        const data = await api.getOrder(orderId);
        if (!isSubscribed) return;

        setOrder(data.order);

        if (data.order.status === 'paid') {
          setStatus('paid');
          return;
        }

        pollCount++;
        setAttempts(pollCount);

        if (pollCount < maxPolls) {
          setTimeout(pollOrderStatus, 2000);
        } else {
          // Timeout: order is still pending webhook confirmation
          setStatus('pending');
        }
      } catch (err) {
        if (!isSubscribed) return;
        setStatus('error');
        setErrorMessage(err.message || 'Failed to verify order status.');
      }
    }

    pollOrderStatus();

    return () => {
      isSubscribed = false;
    };
  }, [orderId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-brand-cream-border p-8 sm:p-10 shadow-xl text-center space-y-6">
        {status === 'polling' && (
          <div className="space-y-4 py-8">
            <div className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              Confirming Your Payment
            </h2>
            <p className="text-sm text-brand-muted max-w-md mx-auto">
              Please wait while our secure server receives verified payment confirmation from Stripe...
            </p>
            <p className="text-xs text-brand-muted/70">
              Verifying webhook signature (Attempt {attempts} of 10)
            </p>
          </div>
        )}

        {status === 'paid' && (
          <>
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
                Payment Confirmed
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-green">
                Thank You for Your Order!
              </h2>
              <p className="text-sm text-brand-muted">
                Order #{order?.id} has been received and paid. Our kitchen is now preparing your food.
              </p>
            </div>

            {order?.items && order.items.length > 0 && (
              <div className="bg-brand-cream/60 rounded-2xl p-5 border border-brand-cream-border/70 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-charcoal uppercase tracking-wider pb-2 border-b border-brand-cream-border">
                  <Receipt className="w-4 h-4 text-brand-green" />
                  Order Receipt
                </div>
                <div className="space-y-2 text-sm">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-brand-charcoal">
                      <span>{item.quantity}× {item.item_name}</span>
                      <span className="font-semibold tabular-nums">
                        £{((item.total_price || (item.unit_price * item.quantity)) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-brand-cream-border flex justify-between font-bold text-base text-brand-green">
                  <span>Total Paid</span>
                  <span className="text-lg text-brand-terracotta tabular-nums">
                    £{(order.total_amount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md shadow-brand-green/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Sofra Home
            </button>
          </>
        )}

        {status === 'pending' && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              Payment Confirmation In Transit
            </h2>
            <p className="text-sm text-brand-muted max-w-md mx-auto">
              Your Stripe checkout transaction has completed. The webhook confirmation is taking slightly longer than usual. Your order is registered and will update shortly.
            </p>
            <p className="text-xs font-semibold text-brand-charcoal">
              Order #{order?.id || orderId}
            </p>
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white px-8 py-3 rounded-full font-semibold text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Menu
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-red-700">
              Verification Notice
            </h2>
            <p className="text-sm text-brand-muted max-w-md mx-auto">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white px-8 py-3 rounded-full font-semibold text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Restaurant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
