const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const connectDB = require("./config/DB");
const app = require("./app");

async function connect() {
  await connectDB();
}
connect();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running in port ${port}`);
});
