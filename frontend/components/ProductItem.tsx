import React from 'react';

export default function ProductItem({ product, quantity, addToCart, removeFromCart }: any) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <article className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between transition-transform duration-200 hover:scale-105">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-40 w-full object-cover rounded-lg mb-3"
        />
      )}

      <div className="flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        {product.description && (
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-indigo-600 font-bold text-base">{formattedPrice}</span>

        <div className="flex items-center gap-2">
          {quantity > 0 && (
            <button
              onClick={() => removeFromCart(product.id)}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded transition-colors"
            >
              –
            </button>
          )}
          <button
            onClick={() => addToCart(product.id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {quantity > 0 && (
        <p className="text-sm text-green-700 mt-2">No carrinho: {quantity}</p>
      )}
    </article>
  );
}
