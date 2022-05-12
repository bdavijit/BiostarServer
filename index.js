const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5001;

//use Middleware
app.use(cors());
app.use(express.json());

//user: bdavijit01
//passWord: Dzo3AL87HCW2MTAR

const uri =
      'mongodb+srv://bdavijit01:Dzo3AL87HCW2MTAR@cluster0.wykix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
});
async function run() {
      try {
            await client.connect();
            const productCollection = client
                  .db('Warehouse')
                  .collection('products');
            const blogCollection = client.db('Warehouse').collection('blogs');

            // get products
            app.get('/products', async (req, res) => {
                  const query = {};
                  const cursor = productCollection.find(query);
                  const products = await cursor.toArray();
                  res.send(products);
            });
            // get products
            app.get('/blogs', async (req, res) => {
                  const query = {};
                  const cursor = blogCollection.find(query);
                  const products = await cursor.toArray();
                  res.send(products);
            });
            // get 6 products
            app.get('/6products', async (req, res) => {
                  const query = {};
                  const cursor = productCollection
                        .find(query)
                        .sort({ _id: 1 })
                        .limit(6);
                  const products = await cursor.toArray();
                  res.send(products);
            });

            // delete a products
            app.delete('/products/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const result = await productCollection.deleteOne(query);
                  res.send(result);
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
