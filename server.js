
//import
require("dotenv").config();

const express= require('express');
const cors= require('cors');
const { MongoClient } = require('mongodb');

const app = express();

const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `${process.env.DB_HOST}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      console.log('connected to database')
      const database = client.db("Aahar-food-delivery");
      const serviceCollactions = database.collection("service");
      const orderCollactions = database.collection("orders");
      

      //GET API
      app.get('/services', async(req,res)=>{
          const cursor= serviceCollactions.find({})
          const services= await cursor.toArray();
          res.send(services)
      })

      //POST API
        app.post ('/services', async(req,res)=>{
            console.log('hit the post')
            const service=req.body;
            console.log('hit the psot api',service);

            const result =await serviceCollactions.insertOne(service)
            console.log(result);
          res.send(result)
        })

         // get my oder
         app.get('/myOders/:email', async(req,res)=>{
          console.log(req.params.email);
          const result =await orderCollactions.find({email: req.params.email}).toArray();
          res.send(result);
      })


        // Add Order
        app.post('/addOrder',(req,res)=>{
          console.log(req.body);
          orderCollactions.insertOne(req.body).then((result)=>{
            res.send(result);
          })


       })
     


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('we are working now full stack developer side')
})




app.listen(port,(req,res)=>{
    console.log('Running port', port)
})