import { createWalletClient, custom } from "https://esm.sh/viem";

const connectBtn = document.getElementById("connectBtn");
let walletClient;
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
connectBtn.onclick = connect;
