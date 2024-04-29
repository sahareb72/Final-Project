//app.js

const express = require('express');
require('dotenv').config();
const ethers = require('ethers');
console.log(ethers.providers); 
const helmet = require('helmet');
const connectDB = require('./mongo');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/settlements', async (req, res) => {
  const db = await connectDB();
  const settlements = await db.collection('settlements').find({}).toArray();
  res.json(settlements);
});

app.post('/api/settlement', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('settlements').insertOne(req.body);
  res.json(result);
});
//const contractABI = require('/Users/saharbajgani/Documents/Blockchain/final.1/hardhat.config.js');  
//const contractABI = require('./ignition/deployments/chain-11155111/artifacts/SimpleContractModule#SimpleContract.json').abi;
//const contractABI = require('./SimpleContractModule#SimpleContract.json').abi;
const contractABI = require('./deployments/sepolia/CBP.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS; //'YOUR_DEPLOYED_CONTRACT_ADDRESS'

//npm install console.log(ethers);
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
//const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const contract = new ethers.Contract(contractAddress, contractABI, provider);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      fontSrc: ["'self'"],
      // Add other directives as needed
    },
  }));

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
