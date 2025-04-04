"use client";

import { useState } from 'react';
import { useOrder } from '@/contexts/order-context';
import { useRouter } from 'next/navigation';

const IS_DEV = process.env.NODE_ENV === 'production';
const DEV_CODE = '123456';
const DEV_CUSTOMER_ID = '290c2abf-6296-44f5-896e-1ee3e6b37584';

export default function LoginSMSPage() {
  const router = useRouter();
  const { order, setOrder } = useOrder();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (raw: string) => {
    return `+55${raw.replace(/\D/g, '')}`;
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
        router.push('/dashboard/customer'); 
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

      router.push('/dashboard/customer');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Entrar com seu Celular</h1>

        {step === 'phone' && (
          <>
            <p className="text-gray-500 text-sm">
              Digite seu número para receber o código de login.
            </p>
            <form onSubmit={handleSendCode} className="space-y-4">
              <input
                type="tel"
                placeholder="(11) 91234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                {loading ? 'Enviando...' : 'Enviar código por SMS'}
              </button>
            </form>
          </>
        )}

        {step === 'code' && (
          <>
            <p className="text-gray-500 text-sm">
              Digite o código que você recebeu no número informado.
            </p>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <input
                type="text"
                placeholder="Código SMS"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
              >
                {loading ? 'Verificando...' : 'Entrar no sistema'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
