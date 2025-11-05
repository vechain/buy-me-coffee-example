import { ethers } from "hardhat";

async function main(): Promise<void> {
  // Get the contract instance
  const contractAddress = "0xdf5db3fdad3be0b7e8c057bb37d18095acfc88d1"; // Use your deployed contract address
  const buyMeACoffee = await ethers.getContractAt("BuyMeACoffee", contractAddress);
  
  // Send a test coffee donation
  const tx = await buyMeACoffee.buyCoffee("Test User", "This is a test coffee donation!", {
    value: ethers.parseEther("1.0") // Sending 1 VET
  });
  
  // Wait for the transaction to be mined
  await tx.wait();
  
  console.log("Test coffee sent! Transaction hash:", tx.hash);
  
  // Verify it worked by calling getSales
  const sales = await buyMeACoffee.getSales();
  console.log("Sales count:", sales.length);
  console.log("First sale details:", {
    from: sales[0].from,
    to: sales[0].to,
    timestamp: sales[0].timestamp.toString(),
    value: ethers.formatEther(sales[0].value),
    name: sales[0].name,
    message: sales[0].message
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
