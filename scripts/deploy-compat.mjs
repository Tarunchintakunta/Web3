// scripts/deploy-compat.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import hardhat runtime
const hre = require("hardhat");

async function main() {
  console.log("Deploying HealthStaking contract...");
  
  // Get ethers from hre
  const { ethers } = hre;
  
  // Deploy HealthStaking contract
  const HealthStaking = await ethers.getContractFactory("HealthStaking");
  const healthStaking = await HealthStaking.deploy();

  await healthStaking.waitForDeployment();
  
  const healthStakingAddress = await healthStaking.getAddress();
  console.log(`HealthStaking deployed to: ${healthStakingAddress}`);
}

// Execute main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });