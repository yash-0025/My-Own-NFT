const { ethers } = require("hardhat");
require("dotenv").config({path :".env"});

async function main() {
    const metadataUrl = "ipfs://QmTGHvmkW6tcWyPm5NjkfuFWngmrqVXS4BPhB31QSzpwPT/";

    const bldContract = await ethers.getContractFactory("BitlordNFT");

    const deployedNFTContract = await bldContract.deploy(metadataUrl);

    await deployedNFTContract.deployed();

    console.log("BitLord NFT contract address:", deployedNFTContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });