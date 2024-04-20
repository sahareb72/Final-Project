const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize ethers provider using Infura
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

// Setup contract
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('./path_to_abi.json');  // Ensure you have ABI JSON file
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Add a wallet
const privateKey = process.env.PRIVATE_KEY; // Your wallet private key
const wallet = new ethers.Wallet(privateKey, provider);

// Connected contract with signer
const paymentContract = contract.connect(wallet);

// KYC Verification route
app.post('/verify-kyc', async (req, res) => {
    const { userAddress } = req.body;
    try {
        const tx = await paymentContract.verifyKYC(userAddress);
        await tx.wait();
        res.json({ message: "KYC verified", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deposit route
app.post('/deposit', async (req, res) => {
    const { amount } = req.body;  // Amount should be in ether
    try {
        const tx = await wallet.sendTransaction({
            to: contractAddress,
            value: ethers.utils.parseEther(amount)
        });
        await tx.wait();
        res.json({ message: "Deposit successful", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send payment route
app.post('/send-payment', async (req, res) => {
    const { recipient, amount, currency } = req.body;
    try {
        const tx = await paymentContract.sendPayment(recipient, ethers.utils.parseEther(amount), currency);
        await tx.wait();
        res.json({ message: "Payment sent", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
