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
      alert("❌ กรุณาเลือกจำนวนสินค้าอย่างน้อย 1 ชิ้น (Please select at least 1 item.) ");
    }
  };

  return (
    <div className="p-10">
      {/* ปุ่มย้อนกลับ */}
      <button
        className="mb-3 px-4 py-2  text-white rounded bg-blue-500  hover:bg-blue-700 "
        onClick={() => router.back()}
      >
        ⬅️ ย้อนกลับ (back)
      </button>

      {/* ปุ่มไปที่ตะกร้าสินค้า */}
      <button
        className="mb-5 ml-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        onClick={() => router.push('/cart')}
      >
        🛒 ไปที่ตะกร้า (cart)
      </button>

      <h1 className="text-3xl font-bold mb-5">หมวดหมู่: {id}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg shadow-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-100 object-cover mb-3 rounded" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.info}</p>
            <p className="text-lg font-bold text-blue-500">{product.price} ฿</p>
            <div className="mt-2 flex items-center gap-2">
              <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => decreaseQty(product.id)}>-</button>
              <span>{quantities[product.id] || 0}</span>
              <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => increaseQty(product.id)}>+</button>
            </div>
            <button
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={() => handleAddToCart(product)}
            >
              🛒 เพิ่มลงตะกร้า (Add to cart)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ ใช้ Static Props แทน Server Side Props
export async function getStaticPaths() {
  const categories = ["ขนมเสริมพัฒนาการสำหรับเด็ก", "โจ๊กข้าวกล้องงอก", "ซุปธัญพืช", "ส่วนผสมและเครื่องปรุงประกอบอาหาร",
    "HEALTHY SNACKS", "INSTANT PORRIDGE", "SOUP", "COOKING INGREDIENTS AND FOOD TOPPINGS"];
  const paths = categories.map((id) => ({ params: { id } }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const API_URL = process.env.API_URL || "https://online-shopping-backend-production.up.railway.app";
  const res = await fetch(`${API_URL}/api/products/${params.id}`);
  const products = await res.json();

  return { props: { products } };
}
