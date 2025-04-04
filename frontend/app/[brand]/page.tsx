import { Suspense } from 'react';
import CardapioPage from './cardapioContainer';

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-gray-600">Carregando cardápio...</div>}>
      <CardapioPage brand={brand} />
    </Suspense>
  );
}
