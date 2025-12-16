const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Celo SenteChain Lending Contract...");
  
  // cUSD address on Celo Mainnet: 0x765DE816845861e75A25fCA122bb6898B8B1282a
  // cUSD address on Alfajores Testnet: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
  
  const network = hre.network.name;
  let cUSDAddress;
  
  if (network === "celo") {
    cUSDAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Mainnet
    console.log("📍 Deploying to Celo Mainnet");
  } else if (network === "alfajores") {
    cUSDAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Testnet
    console.log("📍 Deploying to Alfajores Testnet");
  } else {
    throw new Error("Unsupported network");
  }
  
  console.log("💵 cUSD Address:", cUSDAddress);
  
  // Deploy LendingContract
  const LendingContract = await hre.ethers.getContractFactory("LendingContract");
  const lendingContract = await LendingContract.deploy(cUSDAddress);
  
  await lendingContract.waitForDeployment();
  
  const contractAddress = await lendingContract.getAddress();
  
  console.log("✅ LendingContract deployed to:", contractAddress);
  console.log("\n📝 Add this to your .env file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`NEXT_PUBLIC_CUSD_ADDRESS=${cUSDAddress}`);
  
  console.log("\n🔍 Verify on Celo Explorer:");
  if (network === "celo") {
    console.log(`https://explorer.celo.org/mainnet/address/${contractAddress}`);
  } else {
    console.log(`https://explorer.celo.org/alfajores/address/${contractAddress}`);
  }
  
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
