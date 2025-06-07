export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg my-10">
      <h1 className="text-3xl font-bold mb-4 text-center">📝 นโยบายการชำระเงินและการสั่งซื้อ</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📌 1. เงื่อนไขการสั่งซื้อ</h2>
        <p className="text-gray-700">
          ลูกค้าจะต้องกรอกข้อมูลให้ครบถ้วนและถูกต้องก่อนทำการสั่งซื้อสินค้า หากข้อมูลไม่ครบถ้วน อาจทำให้ไม่สามารถจัดส่งสินค้าได้อย่างถูกต้อง
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">💳 2. วิธีการชำระเงิน</h2>
        <p className="text-gray-700">
          ระบบจะสร้าง QR Code สำหรับชำระเงินผ่าน Omise (พร้อมเพย์) ซึ่งลูกค้าต้องทำรายการภายใน 5 นาทีหลังจากได้รับ QR Code หากไม่ชำระภายในเวลาที่กำหนด จะต้องสั่งซื้อใหม่อีกครั้ง
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📤 3. การยืนยันคำสั่งซื้อ</h2>
        <p className="text-gray-700">
          หลังจากชำระเงินสำเร็จ ระบบจะทำการยืนยันคำสั่งซื้อโดยอัตโนมัติ และจะมีอีเมลยืนยันถูกส่งไปยังอีเมลของลูกค้า
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🔁 4. นโยบายการคืนเงิน</h2>
        <p className="text-gray-700">
          การคืนเงินจะพิจารณาเป็นกรณีไป โดยเฉพาะกรณีที่สินค้าไม่ตรงตามคำอธิบาย หรือเกิดข้อผิดพลาดจากทางร้าน กรุณาติดต่อภายใน 3 วันหลังได้รับสินค้า
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📞 5. ติดต่อสอบถาม</h2>
        <p className="text-gray-700">
          หากมีข้อสงสัยหรือต้องการสอบถามเกี่ยวกับคำสั่งซื้อ กรุณาติดต่อทีมงานผ่านทางอีเมล <span className="text-blue-600">support@yourdomain.com</span> หรือทาง Facebook Page ของเรา
        </p>
      </section>

      <p className="text-center text-gray-500 mt-10 text-sm">ปรับปรุงล่าสุด: 7 มิถุนายน 2025</p>
    </div>
  );
}

