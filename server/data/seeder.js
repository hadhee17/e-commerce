const connectDB = require("../config/DB");
const Product = require("../model/product");

async function connect() {
  await connectDB();
}
connect();

const fetchProduct = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    return await response.json();
  } catch (error) {
    console.log("Error fetching products:", error);
  }
};

const exportDataToDB = async () => {
  try {
    const data = await fetchProduct();
    const transformedProdut = data.map((Products) => ({
      title: Products.title,
      description: Products.description,
      price: Products.price,
      category: Products.category,
      image: Products.image,
      rating: Products.rating?.rate,
    }));
    await Product.insertMany(transformedProdut);
    console.log("Data imported successfully");
    process.exit();
  } catch (error) {
    console.log("Error exporting data to DB:", error);
  }
  process.exit();
};

const deleteDataFromDB = async () => {
  try {
    await Product.deleteMany();
    console.log("Data deleted successfully");
  } catch (error) {
    console.log("Error deleting data from DB:", error);
  }
  process.exit();
};
if (process.argv[2] === "-import") {
  exportDataToDB();
} else if (process.argv[2] === "-delete") {
  deleteDataFromDB();
}
