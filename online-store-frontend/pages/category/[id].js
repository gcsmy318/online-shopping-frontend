import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function CategoryPage({ products }) {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});

  const increaseQty = (productId) => {
    setQuantities((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const decreaseQty = (productId) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      return current > 0 ? { ...prev, [productId]: current - 1 } : prev;
    });
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      addToCart(product, qty);
      alert(`✅ เพิ่ม ${qty} ชิ้นของ ${product.name} ลงในตะกร้า!`);
    } else {
      alert("❌ กรุณาเลือกจำนวนสินค้าอย่างน้อย 1 ชิ้น");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">หมวดหมู่: {id}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg shadow-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-3 rounded" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.info}</p>
            <p className="text-lg font-bold text-blue-500">${product.price}</p>
            <div className="mt-2 flex items-center gap-2">
              <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => decreaseQty(product.id)}>-</button>
              <span>{quantities[product.id] || 0}</span>
              <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => increaseQty(product.id)}>+</button>
            </div>
            <button
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={() => handleAddToCart(product)}
            >
              🛒 เพิ่มลงตะกร้า
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:8080/api/products/${id}`);
  const products = await res.json();
  return { props: { products } };
}
