const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const DB = process.env.DATABASE_BASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("✅ DB connection successful");
  } catch (err) {
    console.log("❌ DB connection failed");
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
