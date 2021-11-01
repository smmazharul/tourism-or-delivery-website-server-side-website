
//import
require("dotenv").config();
const ObjectId =require('mongodb').ObjectId;
const express= require('express');
const cors= require('cors');
const { MongoClient } = require('mongodb');

const app = express();

const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qeyo8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      console.log('connected to database')
      const database = client.db("Aahar-food-delivery");
      const serviceCollactions = database.collection("service");
      const orderCollactions = database.collection("orders");
      const Collactions = database.collection("orderCollection");
      

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
          // confrom order
          app.post('/confrom', async(req,res)=>{
            console.log('confrom')
            const orderConfrom=req.body;
            console.log('hit the psot api',orderConfrom);

            const result =await Collactions.insertOne(orderConfrom)
            console.log(result);
          res.send(result)
          })

        //delete services
        app.delete('/servces/:id', async(req,res)=>{
          const result =await serviceCollactions.deleteOne({
            _id:ObjectId(req.params.id),
         });
         console.log(result);
        })



        // confrom orders
        app.post('/confroms',(req,res)=>{
         console.log(req.body);
         Collactions.insertOne(req.body).then((result)=>res.send(result.insertedId))
        });
     


         // get my oder
         app.get('/myOders/:email', async(req,res)=>{
          console.log(req.params.email);
          const result =await orderCollactions
          .find({email: req.params.email})
          .toArray();
          res.send(result);
      });



      //delete from my order
     app.delete('/deleteProduct/:id', async(req,res)=>{
       console.log(req.params.id);
       const result =await orderCollactions.deleteOne({
         _id:ObjectId(req.params.id),
      });
      console.log(result);
     });



        // Add Order
        app.post('/addOrder',(req,res)=>{
          console.log(req.body);
          orderCollactions.insertOne(req.body).then((result)=>{
            res.send(result);
          });


       });
     


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