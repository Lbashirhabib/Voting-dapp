import { ethers } from 'ethers';

// Load environment variables from .env file
const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const network = import.meta.env.VITE_NETWORK || 'sepolia';

// Validate environment variables
if (!INFURA_API_KEY || !contractAddress) {
  console.error("Missing required environment variables");
  document.getElementById('error-message').textContent = 
    "Configuration error: Please check your environment variables";
}

// Create providers
const infuraUrl = `https://${network}.infura.io/v3/${INFURA_API_KEY}`;
const infuraProvider = new ethers.JsonRpcProvider(infuraUrl);

// WebSocket provider for real-time updates
const webSocketUrl = `wss://${network}.infura.io/ws/v3/${INFURA_API_KEY}`;
const webSocketProvider = new ethers.WebSocketProvider(webSocketUrl);

// Contract ABI (minimal version for voting function)
const contractABI = [
  {
    "inputs": [{"internalType": "uint256","name": "proposal","type": "uint256"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const accountAddressSpan = document.getElementById('accountAddress');
const accountBalanceSpan = document.getElementById('accountBalance');
const vote1Btn = document.getElementById('vote1');
const vote2Btn = document.getElementById('vote2');
const transactionStatusDiv = document.getElementById('transactionStatus');

// Connect Wallet Function
connectWalletBtn.addEventListener('click', async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    const walletProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await walletProvider.getSigner();
    const address = await signer.getAddress();
    
    // Get balance using INFURA
    const balance = await infuraProvider.getBalance(address);
    
    // Update UI
    accountAddressSpan.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    accountBalanceSpan.textContent = ethers.formatEther(balance).slice(0, 6) + " ETH";
    
    // Show connected state
    connectWalletBtn.textContent = "Connected";
    connectWalletBtn.disabled = true;
    
    // Initialize voting contract with signer
    const votingContract = new ethers.Contract(
      contractAddress, 
      contractABI, 
      signer
    );
    
    // Set up voting buttons
    setupVotingButtons(votingContract);
    
    // Set up real-time event listeners
    setupEventListeners();
    
  } catch (error) {
    console.error("Connection error:", error);
    transactionStatusDiv.textContent = `Error: ${error.message}`;
    transactionStatusDiv.style.color = "red";
  }
});

// Voting function setup
function setupVotingButtons(contract) {
  vote1Btn.addEventListener('click', async () => {
    await castVote(contract, 1);
  });
  
  vote2Btn.addEventListener('click', async () => {
    await castVote(contract, 2);
  });
}

// Generic vote casting function
async function castVote(contract, proposal) {
  try {
    updateTransactionStatus(`Sending vote for Proposal ${proposal}...`, 'pending');
    
    const tx = await contract.vote(proposal);
    updateTransactionStatus(`Transaction sent: ${tx.hash}`, 'processing');
    
    const receipt = await tx.wait();
    updateTransactionStatus(
      `Vote for Proposal ${proposal} confirmed! Block: ${receipt.blockNumber}`,
      'success'
    );
    
  } catch (error) {
    console.error("Voting error:", error);
    updateTransactionStatus(
      `Failed to vote: ${error.reason || error.message}`,
      'error'
    );
  }
}

// Real-time event listeners
function setupEventListeners() {
  const wsContract = new ethers.Contract(
    contractAddress, 
    contractABI, 
    webSocketProvider
  );
  
  wsContract.on("Voted", (voter, proposal, event) => {
    const shortAddress = `${voter.substring(0, 6)}...${voter.substring(voter.length - 4)}`;
    updateTransactionStatus(
      `New vote detected: ${shortAddress} voted for Proposal ${proposal}`,
      'event'
    );
  });
  
  // Handle WebSocket connection events
  webSocketProvider._websocket.on('open', () => {
    console.log('WebSocket connected to INFURA');
  });
  
  webSocketProvider._websocket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

// UI status updater
function updateTransactionStatus(message, status) {
  transactionStatusDiv.textContent = message;
  
  const colors = {
    pending: '#FFF3CD', // Yellow
    processing: '#CCE5FF', // Blue
    success: '#D4EDDA', // Green
    error: '#F8D7DA', // Red
    event: '#E2E3E5' // Gray
  };
  
  transactionStatusDiv.style.backgroundColor = colors[status] || '#F8F9FA';
}
// After successful wallet connection
const signer = await provider.getSigner();
const contractWithSigner = votingContract.connect(signer);

// Voting function
async function castVote(proposalNumber) {
  try {
    const tx = await contractWithSigner.vote(proposalNumber);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log('Vote recorded!');
  } catch (error) {
    console.error('Voting failed:', error);
  }
}

// Connect to UI buttons
document.getElementById('vote1').addEventListener('click', () => castVote(1));
document.getElementById('vote2').addEventListener('click', () => castVote(2));
