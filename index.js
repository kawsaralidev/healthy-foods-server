const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzu0z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("healthy-foods");
        const newProductsCollection = database.collection("newProducts");
        const blogsCollection = database.collection("addBlogs");
        const reviewsCollection = database.collection("reviews");
        const featuredCollection = database.collection("featured");
        const usersCollection = database.collection("users");

        //all new products post
        app.post("/newProducts", async (req, res) => {
            const newProducts = req.body;
            const result = await newProductsCollection.insertOne(newProducts);
            console.log(result);
            res.json(result);
        });

        // get all new products
        app.get("/newProducts", async (req, res) => {
            const cursor = newProductsCollection.find({});
            const newProducts = await cursor.toArray();
            res.json(newProducts);
        });

        //all Featured products post
        app.post("/featured", async (req, res) => {
            const featuredProducts = req.body;
            const result = await featuredCollection.insertOne(featuredProducts);
            console.log(result);
            res.json(result);
        });
        // get all Featured products
        app.get("/featured", async (req, res) => {
            const cursor = featuredCollection.find({});
            const featuredProducts = await cursor.toArray();
            res.json(featuredProducts);
        });

        //new blogs post
        app.post("/addBlogs", async (req, res) => {
            const blogs = req.body;
            const result = await blogsCollection.insertOne(blogs);
            console.log(result);
            res.json(result);
        });
        // get all blogs
        app.get("/addBlogs", async (req, res) => {
            const cursor = blogsCollection.find({});
            const blog = await cursor.toArray();
            res.json(blog);
        });
        //new reviews post
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.json(result);
        });
        // get all reviews
        app.get("/reviews", async (req, res) => {
            const cursor = reviewsCollection.find({});
            const review = await cursor.toArray();
            res.json(review);
        });

        // users collection post
        app.post("/users", async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.json(result);
        });

        // update user
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // add admin role
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            console.log("put", user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        });
        //   // find admin
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        //   // delete booking
        //   app.delete("/booking/:id", async (req, res) => {
        //     const id = req.params.id;
        //     console.log("delete user with id", id);
        //     const query = { _id: ObjectId(id) };
        //     const result = await bookingCollection.deleteOne(query);
        //     console.log("deleting user with id", result);
        //     res.json(result);
        //   });
    } finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Healthy-foods!");
});

app.listen(port, () => {
    console.log(`listening at ${port}`);
});
