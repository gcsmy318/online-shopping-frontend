import Link from 'next/link';

export default function Home() {
  const categories = ["electronics", "fashion", "home", "books"];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">🏠 หน้าหลัก</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category} href={`/category/${category}`} className="bg-blue-500 text-white p-4 rounded text-center">
            {category.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
