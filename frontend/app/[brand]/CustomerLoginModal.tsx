'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useOrder } from '@/contexts/order-context';

const IS_DEV = process.env.NODE_ENV !== 'production';
const DEV_CODE = '123456';
const DEV_CUSTOMER_ID = '290c2abf-6296-44f5-896e-1ee3e6b37584';

export default function CustomerLoginModal({
  open,
  onClose,
  onVerified
}: {
  open: boolean;
  onClose: () => void;
  onVerified?: () => void;
}) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { order, setOrder } = useOrder();

  const maskPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '');

    let masked = digits;

    if (digits.length > 0) {
 
      masked = `(${digits.substring(0, 2)}`;
      if (digits.length >= 3) {

        masked += `) ${digits.substring(2, 6)}`;
      }
  
      if (digits.length >= 7) {
        masked += `-${digits.substring(6, 10)}`;
      }

      if (digits.length > 10) {
        masked += digits.substring(10, 11);
      }
    }

    return masked;
  };


  const formatPhone = (masked: string) => {
    const digits = masked.replace(/\D/g, '');
    return `+55${digits}`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  
      if (IS_DEV) {
        setStep('code');
        return;
      }

      const res = await fetch('/api/customer/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    
        body: JSON.stringify({ phone: formatPhone(phone) })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao enviar código');

      setStep('code');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  
      if (IS_DEV && code === DEV_CODE) {
        setOrder({
          ...order!,
          customer_id: DEV_CUSTOMER_ID,
          customer_name: 'Dev User'
        });
        onClose();
        if (onVerified) onVerified();
        return;
      }

      const res = await fetch('/api/customer/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatPhone(phone), code })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao verificar código');

      setOrder({
        ...order!,
        customer_id: data.user.id,
        customer_name: data.user.name,
      });

      onClose();
      if (onVerified) onVerified();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">

      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />


      <div className="relative bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-6 z-50">
        <h1 className="text-2xl font-bold text-gray-800">Identificação pelo Celular</h1>

        {step === 'phone' && (
          <>
            <p className="text-gray-500 text-sm">
              Informe seu número de telefone. Ele será utilizado para armazenar
              seus pedidos e enviar SMS quando estiverem prontos.
            </p>

            <form onSubmit={handleSendCode} className="space-y-4">
              <input
                type="tel"
                placeholder="(11) 91234-5678"
                value={phone}
                onChange={(e) => setPhone(maskPhoneInput(e.target.value))}
                required
                className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {loading ? 'Enviando...' : 'Enviar Código por SMS'}
              </button>
            </form>
          </>
        )}

        {step === 'code' && (
          <>
            <p className="text-gray-500 text-sm">
              Digite o código de confirmação que enviamos por SMS.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <input
                type="text"
                placeholder="Ex: 123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="text-gray-800 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                {loading ? 'Verificando...' : 'Confirmar Código'}
              </button>
            </form>
          </>
        )}
      </div>
    </Dialog>
  );
}
