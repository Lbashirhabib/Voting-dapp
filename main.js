import { ethers } from 'ethers';

// INFURA Configuration
const INFURA_API_KEY = 'b311ae6d1d2646fc89c9b44ef0d24762'; // Replacing with your actual key
const network = 'sepolia'; // Using Sepolia testnet
const infuraUrl = `https://${network}.infura.io/v3/${INFURA_API_KEY}`;

// Create provider using INFURA
const infuraProvider = new ethers.JsonRpcProvider(infuraUrl);

// Adding WebSocket provider right after
const webSocketUrl = `wss://${network}.infura.io/ws/v3/${INFURA_API_KEY}`;
const webSocketProvider = new ethers.WebSocketProvider(webSocketUrl);

// Existing contract address and ABI
const contractAddress = "0x35cd167FA931C6c5f07AbB2621846FC35054ba06";
const contractABI = [/* same ABI as before */];

// Modify the connect wallet function
connectWalletBtn.addEventListener('click', async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await walletProvider.getSigner();
    
    // Use INFURA for read operations
    const address = await signer.getAddress();
    const balance = await infuraProvider.getBalance(address); // Using INFURA here
    
    // Update UI
    accountAddressSpan.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    accountBalanceSpan.textContent = ethers.formatEther(balance);
    
    // Rest of the existing code...
  } catch (error) {
    console.error("Error:", error);
  }
});