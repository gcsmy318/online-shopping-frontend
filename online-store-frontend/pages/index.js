import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/th"); // Redirect ไป /th
  }, []);

  return null; // ไม่ต้องแสดงอะไร
}

