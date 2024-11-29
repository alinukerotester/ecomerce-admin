import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);
  return (
    <Layout>
      <Link
        className="bg-blue-900 text-white rounded-md py-1 px-2"
        href={"/products/new"}
      >
        Add new product
      </Link>
      <table>
        <thead></thead>
      </table>
    </Layout>
  );
}
