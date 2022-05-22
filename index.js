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


const uri =
      `mongodb+srv://${process.env.APP_Key}:${process.env.APP_pass}@cluster0.wykix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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

            // get all products
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
