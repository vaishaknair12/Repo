const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3030;
const axios = require('axios')
const { MongoClient, ObjectId } = require('mongodb');
mongoURI = "mongodb://localhost:27017"

// mongoose.connect('mongodb://localhost:27017', {
//     useNewUrlParser :true,
//     useUnifiedTopology : true,
// })

const apiUrl = 'https://itunes.apple.com/search?term=artist_name&entity=song';


app.get('/fetch-and-store', async (req, res) => {
    try {
      const apiData = await axios.get(apiUrl);
      const dataToStore = apiData.data.results;
      console.log('apiData', apiData)
      console.log('data',dataToStore)

       const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
       const db = client.db('test');
      const collection = db.collection('users');
  
      await collection.insertMany(dataToStore);
      
  
      client.close();
  
      res.json({ message: 'Data fetched and stored successfully.' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/getData', async (req, res) => {
    try{
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('test');
       const collection = db.collection('users');
       console.log(collection)
       const result = await collection.find({}).toArray();
       res.send(result)
    }
    catch(error){
        console.log(error)
    }
  })

  app.put('/updateData', async (req, res) => {
    try{
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('test');
       const collection = db.collection('users');
       const objectId = new ObjectId(req.body._id);
       var values = req.body.values
       const result = await collection.updateOne(
        { _id: objectId },
        { $set: values } // Update with the data from the request body
      );
      console.log(result)
  
      console.log('Document updated:', result);
  
      client.close();
  
      res.json({ message: 'Document updated successfully' });
    }
    catch(error){
        console.log(error)
    }
  })


  app.delete('/deleteData', async (req, res) => {
    try{
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('test');
       const collection = db.collection('users');
       const objectId = new ObjectId(req.body._id);
       var values = req.body.values
       const result = await collection.deleteOne(
        { _id: objectId },
        { $set: values } // Update with the data from the request body
      );
      console.log(result)
  
      console.log('Document deleted:', result);
  
      client.close();
  
      res.json({ message: 'Document deleted successfully' });
    }
    catch(error){
        console.log(error)
    }
  })


//app.get('/', function(req, res){
   // res.render('index.ejs');
  //});

app.listen(3000 , () =>{
    console.log("server listened")
})