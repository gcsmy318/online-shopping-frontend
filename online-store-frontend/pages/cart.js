import { useCart } from '../context/CartContext';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef(null);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!name || !address || !phone) {
      setError('❌ กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    setError('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setQrCodeUrl('');
    setShowModal(false);
    setIsProcessing(false);

    await generateQRCode();
  };

  const generateQRCode = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice * 100 }),
    });

    const data = await res.json();
    const qrUrl = data?.source?.scannable_code?.image?.download_uri;
    const id = data?.id;

    if (!qrUrl || !id) {
      alert('❌ ไม่สามารถสร้าง QR Code ได้');
      return;
    }

    setQrCodeUrl(qrUrl);
    setShowModal(true);
    pollPaymentStatus(id);
  };

  const pollPaymentStatus = (id) => {
    let attempts = 0;
    let intervalTime = 10000;

    const poll = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status/${id}`);
      const data = await res.json();

      if (data.paid) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setShowModal(false);
        setIsProcessing(true); // ✅ แสดง "กำลังทำรายการ..."

        const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, address, phone, cart, totalPrice }),
        });

        if (orderRes.ok) {
          alert('✅ ชำระเงินและส่งอีเมลสำเร็จ!');
          clearCart();
          setName('');
          setAddress('');
          setPhone('');
          setQrCodeUrl('');
          setIsProcessing(false);
          router.push('https://organeh.com');
        } else {
          alert('⚠️ ชำระสำเร็จ แต่ส่งอีเมลไม่สำเร็จ');
          setIsProcessing(false);
        }
      } else {
        attempts++;
        if (attempts === 3) {
          clearInterval(intervalRef.current);
          intervalTime = 30000;
          intervalRef.current = setInterval(poll, intervalTime);
        }
      }
    };

    intervalRef.current = setInterval(poll, intervalTime);

    // auto-stop after 5 mins
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 5 * 60 * 1000);
  };

  return (
    <div className="p-10 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg relative">

      {isProcessing && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
          <div className="text-xl text-blue-600 font-bold">⏳ กำลังทำรายการ กรุณารอสักครู่...</div>
        </div>
      )}

      <button className="mb-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center" onClick={() => router.back()}>
        ⬅️ ย้อนกลับ
      </button>

      <h2 className="text-3xl font-bold mb-5 text-center">🛒 ตะกร้าสินค้าของคุณ</h2>

      {cart.length === 0 ? (
        <p className="text-red-500 text-lg text-center">❌ ตะกร้าสินค้าว่าง</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="border rounded-lg shadow p-4 flex items-center gap-4 bg-white">
              <Image
                src={item.image.startsWith('https') ? item.image : `https://organeh.com/shop${item.image}`}
                alt={item.name}
                width={96} // ✅ ความกว้าง (px)
                height={96} // ✅ ความสูง (px)
                className="object-cover rounded"
              />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-lg font-bold text-blue-500">{item.price}฿</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="bg-gray-300 px-3 py-1 rounded text-lg" onClick={() => updateQuantity(item.id, item.quantity - 1)}>➖</button>
                  <span className="text-lg">{item.quantity}</span>
                  <button className="bg-gray-300 px-3 py-1 rounded text-lg" onClick={() => updateQuantity(item.id, item.quantity + 1)}>➕</button>
                </div>
              </div>
              <button className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center" onClick={() => removeFromCart(item.id)}>
                🗑 ลบ
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <h2 className="text-2xl font-bold text-green-500 mt-5 text-center">💰 ราคารวมทั้งหมด: {totalPrice}฿</h2>
      )}

      <div className="mt-5 bg-white p-5 rounded-lg shadow-lg">
        <label className="block text-lg font-bold">👤 ชื่อ :</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded mt-1" />

        <label className="block text-lg font-bold mt-3">📍 ที่อยู่ :</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-2 rounded mt-1" rows="3" />

        <label className="block text-lg font-bold mt-3">📞 เบอร์โทร :</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded mt-1" />

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <button
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 w-full text-lg"
          onClick={handleOrder}
          disabled={cart.length === 0}
        >
          🛍 สั่งซื้อสินค้า
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-xl font-bold mb-4">📲 สแกนเพื่อชำระเงิน</h2>
            <img src={qrCodeUrl} alt="PromptPay QR Code" className="mx-auto mb-4 w-60" />
            <p className="text-blue-500">⏳ กรุณาชำระเงินภายในระยะเวลา 5 นาที</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              ❌ ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
