const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(express());
app.use(express.json());
app.use(cors());

// =================================================================

// ===========================mongoDB section======================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmvmv30.mongodb.net/?retryWrites=true&w=majority`;

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
    const cartCollection = client.db("luxAuraCart").collection("Cart");
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

    // ==================post the cart on the my cart page ===============================================
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      console.log(cart); //show in the server console
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });
    // ==================get the cart on the my cart page ===============================================
    app.get("/carts", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // ===============================delete cart from my cart ==================================
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // ================================get  products from database to server=============================================================
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //========================get data details========================================

    // =====================update product============================================

    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    app.put("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;

      const product = {
        $set: {
          photo: updateProduct.photo,
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          description: updateProduct.description,
          rating: updateProduct.rating,
        },
      };
      const result = await brandCollection.updateOne(filter, product, options);
      res.send(result);
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
