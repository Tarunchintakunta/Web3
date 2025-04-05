// CommonJS syntax
const hre = require("hardhat");

async function main() {
  console.log("Deploying HealthStaking contract...");
  
  // Deploy HealthStaking contract
  const HealthStaking = await hre.ethers.getContractFactory("HealthStaking");
  const healthStaking = await HealthStaking.deploy();

  await healthStaking.waitForDeployment();
  
  const healthStakingAddress = await healthStaking.getAddress();
  console.log(`HealthStaking deployed to: ${healthStakingAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });