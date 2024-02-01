import { ethers } from "hardhat";

async function main() {
  const name = "Zahrah";
  const age = 29;
  const location = "Jos, Plateau state, Nigeria"
  const entity = await ethers.deployContract("SimpleRegistry", [name, age, location], {
  });

  await entity.waitForDeployment();

  console.log(
    `Contract deployed to ${entity.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
