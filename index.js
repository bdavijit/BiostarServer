const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5001;

//use Middleware
app.use(cors());
app.use(express.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.APP_Key}:${process.env.APP_pass}@cluster0.wykix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
});
async function run() {
      try {
            await client.connect();
            const productCollection = client
                  .db('BioStar')
                  .collection('products');
            const blogCollection = client.db('BioStar').collection('blogs');
            const reviewCollection = client.db('BioStar').collection('reviews');
            const OrderCollection = client.db('BioStar').collection('Order');
            const userCollection = client.db('BioStar').collection('Users');

            
            // get one user
            app.get('/users/:email', async (req, res) => {
                  const Pemail = req.params.email;
                  const query = { email : Pemail };
                  const user = await userCollection.findOne(query);
                  res.send(user);
            });

            //update profile
            app.put('/user2/:email', async (req, res) => {
                  const email = req.params.email;
                  const updatedUser = req.body;
                  const filter = { email: email };
                  const options = { upsert: true };
                  const updatedDoc = {
                        $set: {
                              name: updatedUser?.name,
                              email: updatedUser?.email,
                              city: updatedUser?.city,
                              phone_number: updatedUser?.phone_number,
                              LinkedIn: updatedUser?.LinkedIn,
                              education: updatedUser?.education,
                              role: updatedUser?.role,
                              userName: '',
                        },
                  };
                  const result = await userCollection.updateOne(
                        filter,
                        updatedDoc,
                        options
                  );
                  res.send(result);
            });
            // get User
            app.get('/User', async (req, res) => {
                  const query = {};
                  const cursor = userCollection.find(query);
                  const User = await cursor.toArray();
                  res.send(User);
            });
            //update Product
            app.put('/Product/:id', async (req, res) => {
                  const id = req.params.id;
                  const updatedProduct = req.body;
                  const filter = { _id: ObjectId(id) };
                  const options = { upsert: true };
                  const updatedDoc = {
                        $set: {
                              name: updatedProduct?.name,
                              image: updatedProduct?.image,
                              minimumOrder: updatedProduct?.minimumOrder,
                              price: updatedProduct?.price,
                              quantity: updatedProduct?.quantity,
                              sold: updatedProduct?.sold,
                              UserEmail: updatedProduct?.UserEmail,
                              description: updatedProduct?.description,
                        },
                  };
                  const result = await productCollection.updateOne(
                        filter,
                        updatedDoc,
                        options
                  );
                  res.send(result);
            });

            // add a new Product
            app.post('/Product', async (req, res) => {
                  const newProduct = req.body;
                  const result = await productCollection.insertOne(newProduct);
                  res.send(result);
            });
            // add a new user
            app.post('/User', async (req, res) => {
                  const newUser = req.body;
                  const result = await userCollection.insertOne(newUser);
                  res.send(result);
            });

            //update profile
            app.put('/user/:email', async (req, res) => {
                  const email = req.params.email;
                  const updatedUser = req.body;
                  const filter = { email: email };
                  const options = { upsert: true };
                  const updatedDoc = {
                        $set: {
                              name: updatedUser?.name,
                              email: updatedUser?.email,
                              city: updatedUser?.city,
                              phone_number: updatedUser?.phone_number,
                              LinkedIn: updatedUser?.LinkedIn,
                              education: updatedUser?.education,
                        },
                  };
                  const result = await userCollection.updateOne(
                        filter,
                        updatedDoc,
                        options
                  );
                  res.send(result);
            });
            // delete a Order
            app.delete('/Order/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const result = await OrderCollection.deleteOne(query);
                  res.send(result);
            });
            // get Orders
            app.get('/Orders/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { email: email };
                  const cursor = OrderCollection.find(query);
                  const Orders = await cursor.toArray();
                  res.send(Orders);
            });
            // get Product
            app.get('/Product/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { UserEmail: email };
                  const cursor = productCollection.find(query);
                  const Product = await cursor.toArray();
                  res.send(Product);
            });
            // add a new Order
            app.post('/Order', async (req, res) => {
                  const newUser = req.body;

                  const result = await OrderCollection.insertOne(newUser);
                  res.send(result);
            });

            app.get('/products/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const result = await productCollection.findOne(query);
                  res.send(result);
            });
            app.post('/review', async (req, res) => {
                  const newUser = req.body;

                  const result = await reviewCollection.insertOne(newUser);
                  res.send(result);
            });
            // get all reviews
            //http://localhost:5001/reviews?page=0&size=3
            app.get('/reviews', async (req, res) => {
                  const page = parseInt(req.query.page);
                  const size = parseInt(req.query.size);

                  const query = {};
                  const cursor = reviewCollection.find(query);

                  let reviews;
                  if (page || size) {
                        reviews = await cursor
                              .skip(page * size)
                              .limit(size)
                              .toArray();
                  } else {
                        reviews = await cursor.toArray();
                  }
                  res.send(reviews);
            });
            //http://localhost:5001/products?page=0&size=3
            app.get('/products', async (req, res) => {
                  const page = parseInt(req.query.page);
                  const size = parseInt(req.query.size);

                  const query = {};
                  const cursor = productCollection.find(query);

                  let products;
                  if (page || size) {
                        products = await cursor
                              .skip(page * size)
                              .limit(size)
                              .toArray();
                  } else {
                        products = await cursor.toArray();
                  }
                  res.send(products);
            });
      } finally {
            //connection close
            //await client.close();
      }
}

//call function (async hole catch diya jai )
run().catch(console.dir);

app.get('/', (req, res) => {
      res.send('Running My Node CRUD Server');
});

app.listen(port, () => {
      console.log('CRUD Server is running');
});
