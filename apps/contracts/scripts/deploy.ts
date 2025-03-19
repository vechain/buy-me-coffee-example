import { ethers } from "hardhat";
import { updateConfig, config } from '@repo/config-contract';
import {getABI} from "../utils/abi";

async function main(): Promise<void> {
    const contract = await ethers.deployContract('BuyMeACoffee');
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    console.log(`BuyMeACoffee Contract deployed with address: ${address}`);
    const tokenABI = await getABI('BuyMeACoffee');
    updateConfig(
        {
            ...config,
            CONTRACT_ADDRESS: address,
        },
        tokenABI
    )
    console.log('Config updated');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});