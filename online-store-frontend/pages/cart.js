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
      setError("❌ กรุณากรอกข้อมูลให้ครบทุกช่อง (Please fill in all fields.) ");
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
        alert('✅ สั่งซื้อสำเร็จ! ระบบจะพาคุณกลับไปที่หน้าหลัก (Order completed! You will be taken back to the home page.)');
        clearCart();  // ✅ ล้างตะกร้า
        router.push('https://gcsmy318.github.io/web/index.html');  // ✅ Redirect ไปหน้าแรก
      } else {
        alert('❌ ไม่สามารถสั่งซื้อได้ (Unable to order) !');
      }
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการสั่งสินค้า (There was an error while ordering.)!');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg">
      {/* ปุ่มย้อนกลับ */}
      <button
        className="mb-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center"
        onClick={() => router.back()}
      >
        ⬅️ ย้อนกลับ (ฺฺBack)
      </button>

      <h2 className="text-3xl font-bold mb-5 text-center">🛒 ตะกร้าสินค้าของคุณ (Your cart.) </h2>

      {cart.length === 0 ? (
        <p className="text-red-500 text-lg text-center">❌ ตะกร้าสินค้าว่าง (Cart is empty.)</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="border rounded-lg shadow p-4 flex items-center gap-4 bg-white">
              {/* ✅ รูปภาพสินค้า */}
              <img
                src={item.image.startsWith('http') ? item.image : `https://online-shopping-frontend-beta.vercel.app${item.image}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              {/* ✅ รายละเอียดสินค้า */}
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-lg font-bold text-blue-500">{item.price}฿</p>

                {/* ✅ ปุ่มเพิ่มลดจำนวน */}
                <div className="flex items-center gap-2 mt-2">
                  <button className="bg-gray-300 px-3 py-1 rounded text-lg" onClick={() => updateQuantity(item.id, item.quantity - 1)}>➖</button>
                  <span className="text-lg">{item.quantity}</span>
                  <button className="bg-gray-300 px-3 py-1 rounded text-lg" onClick={() => updateQuantity(item.id, item.quantity + 1)}>➕</button>
                </div>
              </div>

              {/* ✅ ปุ่มลบสินค้า */}
              <button className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center" onClick={() => removeFromCart(item.id)}>
                🗑 ลบ
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ แสดงราคารวมทั้งหมด */}
      {cart.length > 0 && (
        <h2 className="text-2xl font-bold text-green-500 mt-5 text-center">💰 ราคารวมทั้งหมด (Total price): {totalPrice}฿</h2>
      )}

      {/* ✅ ฟอร์มสำหรับกรอกข้อมูลลูกค้า */}
      <div className="mt-5 bg-white p-5 rounded-lg shadow-lg">
        <label className="block text-lg font-bold">👤 ชื่อ (Name) :</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกชื่อของคุณ..."
        />

        <label className="block text-lg font-bold mt-3">📍 ที่อยู่ (Address) :</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกที่อยู่ของคุณ..."
          rows="3"
        />

        <label className="block text-lg font-bold mt-3">📞 เบอร์โทร (Telephone):</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกเบอร์โทรศัพท์ของคุณ..."
        />

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {/* ✅ ปุ่มสั่งซื้อสินค้า */}
        <button
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 w-full text-lg"
          onClick={handleOrder}
          disabled={isOrdering || cart.length === 0}
        >
          {isOrdering ? "⏳ กำลังสั่งซื้อ(Ordering)..." : "🛍 สั่งซื้อสินค้า(Order)"}
        </button>
      </div>
    </div>
  );
}
