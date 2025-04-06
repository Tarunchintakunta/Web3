const hre = require("hardhat");

async function main() {
  console.log("Deploying DoctorAppointments contract...");
  
  // Deploy the contract
  const DoctorAppointments = await hre.ethers.getContractFactory("DoctorAppointments");
  const doctorAppointments = await DoctorAppointments.deploy();

  await doctorAppointments.waitForDeployment();
  
  const doctorAppointmentsAddress = await doctorAppointments.getAddress();
  console.log(`DoctorAppointments deployed to: ${doctorAppointmentsAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });