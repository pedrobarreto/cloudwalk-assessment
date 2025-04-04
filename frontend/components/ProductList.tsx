import ProductItem from "./ProductItem";
export default function ProductList({ products, cart, addToCart, removeFromCart }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product: any) => (
        <ProductItem
          key={product.id}
          product={product}
          quantity={cart[product.id] || 0}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
    </div>
  );
}
