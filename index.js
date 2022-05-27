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
