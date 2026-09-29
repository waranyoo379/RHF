"use client";
import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import ProductSearchForm from "./ProductSearchForm";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";
export default function ProductExplorerQuery() {
  const [query, setQuery] = useState<SearchQuery>(defaultQuery);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", query],
    queryFn: () => fetchProducts(query),
  });
  async function search(next: SearchQuery) {
    setQuery(next);
  }
  return (
    <main>
      <ProductSearchForm onSearch={search} />
      {isPending && <p>กําลังโหลดข้อมูล</p>}
      {isError && <p role="alert">{error.message}</p>}
      {data?.products.length === 0 && <p>ไม่พบสินค้าที:ตรงกับเงื:อนไข</p>}
      {data && data.products.length > 0 && (
        <ul>
          {data.products.map((item) => (
            <li key={item.id}>
              {item.thumbnail && (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={48}
                  height={48}
                />
              )}
              {item.title} {item.price}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}