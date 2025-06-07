import Link from 'next/link';

export default function Home() {
  const categories = ["HEALTHY SNACKS", "INSTANT PORRIDGE", "SOUP", "COOKING INGREDIENTS AND FOOD TOPPINGS","PROMOTION"];

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
