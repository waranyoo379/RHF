"use client";

import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  // ทำงานเพียงครั้งเดียวตอนแสดงผลครั้งแรก
  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  function saveProduct(draft: ProductDraft) {
    setProducts([...products, { ...draft, id: Date.now() }]);
  }

  return (
    <main>
      <h1>รายการสินค้า</h1>

      {/* ฟอร์มสำหรับเพิ่มสินค้า */}
      <ProductForm
        editing={null}
        onSave={saveProduct}
        onCancel={() => {}}
      />

      {/* ฟอร์มสำหรับค้นหาสินค้า */}
      <ProductSearchForm onSearch={loadProducts} />

      <section aria-live="polite">
        {/* นำบรรทัดของสถานะ idle ออก เพราะหน้าจอโหลดเองตั้งแต่เปิด */}
        {status === "loading" && <p>กำลังโหลดข้อมูล</p>}

        {status === "error" && <p role="alert">{errorMessage}</p>}

        {status === "ready" && products.length === 0 && (
          <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}

        {status === "ready" && products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>หมวดหมู่</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}