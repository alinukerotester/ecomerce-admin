import Layout from "@/components/Layout";
import { useState } from "react";

export default function NewProduct() {
  const [tittle, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  return (
    <Layout>
      <h1>New Product</h1>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={tittle}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button className="btn-primary">Save</button>
    </Layout>
  );
}
