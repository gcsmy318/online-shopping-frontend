import Link from 'next/link';

export default function Home() {
  const categories = ["ขนมเสริมพัฒนาการสำหรับเด็ก", "โจ๊กข้าวกล้องงอก", "ซุปธัญพืช", "ส่วนผสมและเครื่องปรุงประกอบอาหาร","โปรโมชั่น"];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5"> </h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {categories.map((category) => (
          <Link key={category} href={`/category/${category}`} className="bg-blue-500 text-white p-5 rounded text-center">
            {category.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
