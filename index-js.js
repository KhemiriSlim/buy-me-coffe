import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
} from "https://esm.sh/viem";
import { contractAddress, abi } from "./constant-js.js";
const connectBtn = document.getElementById("connectBtn");
const funButton = document.getElementById("fundButton");
const ethAmount = document.getElementById("ethamount");
const balanceButton = document.getElementById("getBalanceBtn");
const withdrawButton = document.getElementById("withdrawButton");
let walletClient;
let publicClient;
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    await walletClient.requestAddresses();
    connectBtn.innerText = "Wallet Connected!";
  } else {
    connectBtn.innerText = "Please install MetaMask!";
  }
}

async function fund() {
  const ethAmountValue = ethAmount.value;
  console.log(`Funding with ${ethAmountValue} ETH`);
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedAccount] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "fund",
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(ethAmountValue),
    });
    const hash = await walletClient.writeContract(request);
    console.log("Transaction sent! Hash:", hash);
  } else {
    connectBtn.innerText = "Please install MetaMask!";
  }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}

async function getBalance(){
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
  }
  const balance = await publicClient.getBalance({
    address: contractAddress,
  })
  console.log(formatEther(balance));
}

async function withdraw() {
  console.log(`Withdrawing...`)

  if (typeof window.ethereum !== "undefined") {
    try {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      })
      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      })
      const [account] = await walletClient.requestAddresses()
      const currentChain = await getCurrentChain(walletClient)

      console.log("Processing transaction...")
      const { request } = await publicClient.simulateContract({
        account,
        address: contractAddress,
        abi,
        functionName: "withdraw",
        chain: currentChain,
      })
      const hash = await walletClient.writeContract(request)
      console.log("Transaction processed: ", hash)
    } catch (error) {
      console.log(error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}
connectBtn.onclick = connect;
funButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;