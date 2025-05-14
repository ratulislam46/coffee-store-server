const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// pass : nsAHHWU17UFN5bax 
// user : coffeeDB 

console.log(process.env.COFFEE_Name)
console.log(process.env.COFFEE_PASS)


const uri = `mongodb+srv://${process.env.COFFEE_Name}:${process.env.COFFEE_PASS}@cluster0.ibgq1ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffees')


        // create data in database 
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })


        // get data in database 
        app.get('/coffees', async (req, res) => {
            // const curson = coffeeCollection.find();
            // const result = await curson. toArray();
            const resultAnother = await coffeeCollection.find().toArray();
            res.send(resultAnother)
        })


        // get data dynamicly in database 
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.findOne(query);
            res.send(result)
        })


        //delete data in database 
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffee server on running')
})

app.listen(port, () => {
    console.log(`coffee server running on port${port}`);
})