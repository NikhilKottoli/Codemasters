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
        console.log(err)
    }

   

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})