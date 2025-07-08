import { ethers } from "hardhat"

async function main() {
  const DummyNft = await ethers.getContractFactory("DummyNft")
  const nft = await DummyNft.deploy()
  await nft.waitForDeployment()

  console.log("DummyNft deployed to:", await nft.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})