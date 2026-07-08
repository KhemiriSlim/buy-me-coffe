import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
} from "https://esm.sh/viem";
import { contractAddress, abi } from "./constant-js.js";
const connectBtn = document.getElementById("connectBtn");
const funButton = document.getElementById("fundButton");
const ethAmount = document.getElementById("ethamount");
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
  const ehtAmountValue = ethAmount.value;
  console.log(`Funding with ${ehtAmountValue} ETH`);
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedAccount] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "fund",
      account: connectedAccount,
      chaine: currentChain,
      value: parseEther(ethAmountValue),
    });
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
connectBtn.onclick = connect;
funButton.onclick = fund;
