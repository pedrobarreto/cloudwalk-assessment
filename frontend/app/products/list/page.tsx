'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Erro ao carregar os produtos');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Erro ao deletar o produto');
      }
      // Atualiza a lista removendo o produto deletado
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro inesperado ao deletar o produto.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-800">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
          <div className="flex gap-4">
            <Link href="/dashboard/user">
              <button className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                Voltar para Dashboard
              </button>
            </Link>
            <Link href="/products/new">
              <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Adicionar Novo Produto
              </button>
            </Link>
          </div>
        </div>
        {products.length === 0 ? (
          <p className="text-gray-800">Nenhum produto cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Imagem</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Nome</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Preço</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-800">Sem imagem</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-800">{product.name}</td>
                    <td className="py-3 px-4 text-gray-800">R$ {product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/products/edit/${product.id}`}>
                          <button className="bg-yellow-500 text-white font-medium py-1 px-3 rounded hover:bg-yellow-600 transition">
                            Editar
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 text-white font-medium py-1 px-3 rounded hover:bg-red-600 transition"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
