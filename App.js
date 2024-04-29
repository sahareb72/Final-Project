import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = require('./CBP.json'); // Update with actual path to ABI

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState('');
  const [signer, setSigner] = useState('');
  const [contract, setContract] = useState('');
  const [balance, setBalance] = useState('');
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState('');

  // Connect to Ethereum wallet
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          setProvider(provider);
          setAccount(accounts[0]);
          const signer = provider.getSigner();
          setSigner(signer);
          const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to metamask", error);
        }
      } else {
        alert("Ethereum object not found, install MetaMask.");
      }
    };

    connectWallet();
  }, []);

  // Fetch the balance from the contract
  useEffect(() => {
    const fetchBalance = async () => {
      if (contract && account) {
        const balance = await contract.balances(account);
        setBalance(ethers.utils.formatEther(balance));
      }
    };

    fetchBalance();
  }, [contract, account]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amount.toString()) });
    await tx.wait();
    alert('Deposit successful');
  };

  const handleSendPayment = async (e) => {
    e.preventDefault();
    const tx = await contract.sendPayment(recipient, ethers.utils.parseEther(amount.toString()), "USD");
    await tx.wait();
    alert('Payment successful');
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Account: {account}</p>
        <p>Balance: {balance} ETH</p>

        <form onSubmit={handleDeposit}>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount to Deposit" />
          <button type="submit">Deposit</button>
        </form>

        <form onSubmit={handleSendPayment}>
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient Address" />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount to Send" />
          <button type="submit">Send Payment</button>
        </form>
      </header>
    </div>
  );
}

export default App;
