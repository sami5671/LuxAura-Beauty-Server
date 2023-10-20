const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(express());
app.use(express.json());
app.use(cors());

// =================================================================
// username: cosmeticAndBeautyProduct
// password: qWUtivsREY8fN258
// ===========================mongoDB section======================================

const uri =
  "mongodb+srv://cosmeticAndBeautyProduct:qWUtivsREY8fN258@cluster0.fmvmv30.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // =========================Creating the database========================================
    const productCollection = client.db("luxAuraBeauty").collection("product");

    const brandCollection = client.db("luxAuraBrand").collection("Brand");
    // =======================pOST DATA TO THE DATABASE==========================================
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct); //show in the server console
      const result = await productCollection.insertOne(newProduct);
      res.send(result); //sending data to server to database
    });

    app.post("/brands", async (req, res) => {
      const brands = req.body;
      console.log(brands); //show in the server console
      const result = await brandCollection.insertOne(brands);
      res.send(result); //sending data to server to database
    });

    // ================================get  products from database to server=============================================================
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result); //sending data to get all coffee from database
    });
    //  =================================================================
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =============================================================================
app.get("/", (req, res) => {
  res.send("My product Server is Running!!!!!!!");
});

app.listen(port, () => {
  console.log(`My Product server is running on port ${port}`);
});
// =============================================================================
