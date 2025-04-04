'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">

      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
   
      <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-3xl w-full h-[90vh] z-10 overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}


function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, '');
  let formatted = '';
  if (digits.length > 0) {
    formatted = digits.substring(0, 2);
  }
  if (digits.length >= 3) {
    formatted += '.' + digits.substring(2, 5);
  }
  if (digits.length >= 6) {
    formatted += '.' + digits.substring(5, 8);
  }
  if (digits.length >= 9) {
    formatted += '/' + digits.substring(8, 12);
  }
  if (digits.length >= 13) {
    formatted += '-' + digits.substring(12, 14);
  }
  return formatted;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [brand, setBrand] = useState('');
  const [approvedPaymentMethods, setApprovedPaymentMethods] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleCheckboxChange = (method: string) => {
    if (approvedPaymentMethods.includes(method)) {
      setApprovedPaymentMethods(approvedPaymentMethods.filter((m) => m !== method));
    } else {
      setApprovedPaymentMethods([...approvedPaymentMethods, method]);
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setCnpj(formatCnpj(rawValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'user',
          name,
          email,
          password,
          cnpj,
          brand,
          approved_payment_methods: approvedPaymentMethods,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao registrar usuário');
      }
      setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Cadastro</h1>
        

        <div className="mb-4">
          <label htmlFor="brand" className="block text-gray-700 mb-1">
            Brand (Seu @ da empresa)
          </label>
          <input
            type="text"
            id="brand"
            placeholder="Digite o @ da sua empresa"
            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
          <p className="text-sm text-gray-600 mt-1">
            Esse será o @ da sua empresa e não poderá ser alterado após o cadastro.
          </p>
        </div>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              placeholder="Digite seu nome"
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              placeholder="Crie uma senha"
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="cnpj" className="block text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              placeholder="00.000.000/0000-00"
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={cnpj}
              onChange={handleCnpjChange}
              maxLength={18}
              required
            />
          </div>
          <div>
            <p className="block text-gray-700 mb-2">Métodos de Pagamento Aprovados:</p>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={approvedPaymentMethods.includes('pix')}
                  onChange={() => handleCheckboxChange('pix')}
                />
                Pix
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={approvedPaymentMethods.includes('dinheiro')}
                  onChange={() => handleCheckboxChange('dinheiro')}
                />
                Dinheiro
              </label>
              <label className="flex flex-col border p-3 rounded-lg text-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={approvedPaymentMethods.includes('credit_card')}
                    onChange={() => handleCheckboxChange('credit_card')}
                  />
                  <span className="font-semibold">Cartão de Crédito</span>
                </div>
                <span className="text-sm text-gray-600 ml-6 mt-1">
                  Feito através da InfinitePay - transforme seu celular em uma maquininha de cartão de graça.
                </span>
                <img
                  src="https://i.ytimg.com/vi/o-7PZGcwlYo/maxresdefault.jpg"
                  alt="InfinitePay Banner"
                  className="mt-2 rounded cursor-pointer"
                  onClick={() => setModalIsOpen(true)}
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Já possui uma conta?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>

      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <div className="w-full h-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/o-7PZGcwlYo"
            title="InfinitePay Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </div>
  );
}
