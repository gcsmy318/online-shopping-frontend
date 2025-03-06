import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError("❌ กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    setError('');

    setIsOrdering(true);
    const orderData = { name, address, phone, cart, totalPrice };

    try {
      const res = await fetch('https://online-shopping-backend-production.up.railway.app/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert('✅ สั่งซื้อสำเร็จ! ระบบจะพาคุณกลับไปที่หน้าหลัก');
        clearCart();  // ✅ ล้างตะกร้า
        router.push('https://gcsmy318.github.io/web/index.html');  // ✅ Redirect ไปหน้าแรก
      } else {
        alert('❌ ไม่สามารถสั่งซื้อได้!');
      }
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการสั่งสินค้า!');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="p-10">
      {/* ปุ่มย้อนกลับ */}
      <button
        className="mb-5 px-4 py-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={() => router.back()}
      >
        ⬅️ ย้อนกลับ
      </button>

      <h1 className="text-3xl font-bold mb-5">🛒 ตะกร้าสินค้าของคุณ</h1>

      {cart.length === 0 ? (
        <p className="text-red-500">❌ ตะกร้าสินค้าว่างเปล่า</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="border rounded-lg shadow-lg p-4 mb-4 flex items-center justify-between">
            {/* ✅ แสดงรูปภาพสินค้า */}
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />

            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-lg font-bold text-blue-500">{item.price}฿</p>

            <div className="flex items-center gap-2">
              <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => removeFromCart(item.id)}>🗑 ลบออก</button>
          </div>
        ))
      )}

      <h2 className="text-2xl font-bold text-green-500">💰 ราคารวมทั้งหมด: {totalPrice}฿</h2>

      <div className="mt-5">
        <label className="block text-lg font-bold">👤 ชื่อ:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกชื่อของคุณ..."
        />

        <label className="block text-lg font-bold mt-3">📍 ที่อยู่:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกที่อยู่ของคุณ..."
          rows="3"
        />

        <label className="block text-lg font-bold mt-3">📞 เบอร์โทร:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกเบอร์โทรศัพท์ของคุณ..."
        />

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <button
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
          onClick={handleOrder}
          disabled={isOrdering || cart.length === 0}
        >
          {isOrdering ? "⏳ กำลังสั่งซื้อ..." : "🛍 สั่งซื้อสินค้า"}
        </button>
      </div>
    </div>
  );
}
