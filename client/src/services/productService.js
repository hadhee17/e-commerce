import api from "./api";

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const endpoint = queryString
    ? `/product/get-all-product?${queryString}`
    : "/product/get-all-product";

  const res = await api.get(endpoint);
  return res.data.products;
}

export async function getProductById(id) {
  const res = await api.get(`/product/get-product/${id}`);
  return res.data.product;
}

/* 🔹 Create Product */
export async function createProduct(body) {
  const res = await api.post("/product/create-product", body);
  return res.data;
}

/* 🔹 Get My Products (seller-specific) */
export async function getMyProduct() {
  const res = await api.get("/product/get-my-product");
  return res.data.data;
}
