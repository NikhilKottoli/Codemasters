const { parse } = require('dotenv');
const express = require('express')
const {createClient}=require('redis')


const app = express()
const port = 3000
const redis_url=process.env.REDIS_URL;

const client=createClient();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/test',async(req,res)=>{
    try {
    const data =req.body;
    await client.connect();
    await client.lPush('submissions',JSON.stringify(data));    
    res.status(200).json({message:"success"})
    } catch (err) {
        console.log(err);
    }  
})

app.get('/tasks', async(req, res) => {
  try {
    await client.connect();
    const tasks = await client.lRange('submissions',0,-1);
    const parsedTasks = tasks.map(task => JSON.parse(task));
    console.log('Tasks:', parsedTasks);
    res.status(200).json(parsedTasks);
  } catch (error) {
    console.error(error.message);
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})