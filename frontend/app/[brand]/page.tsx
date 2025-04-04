import { Suspense } from 'react';
import CardapioPage from './cardapioContainer';

export default function BrandPage({ params }: { params: { brand: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-gray-600">Carregando cardápio...</div>}>
      <CardapioPage brand={params.brand} />
    </Suspense>
  );
}
