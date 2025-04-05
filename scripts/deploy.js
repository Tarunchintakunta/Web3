// We require the Hardhat Runtime Environment explicitly here.
const hre = require("hardhat");

async function main() {
  // Deploy the HealthStaking contract
  const HealthStaking = await hre.ethers.getContractFactory("HealthStaking");
  const healthStaking = await HealthStaking.deploy();

  await healthStaking.waitForDeployment();

  const address = await healthStaking.getAddress();
  console.log(`HealthStaking deployed to: ${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});