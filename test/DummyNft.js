const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("DummyNft", function () {
  it("owner can mint and increment", async function () {
    const [owner] = await ethers.getSigners()
    const DummyNft = await ethers.getContractFactory("DummyNft")
    const nft = await DummyNft.deploy()
    await nft.waitForDeployment()

    await expect(nft.mint(owner.address)).to.not.be.reverted
    expect(await nft.tokenCounter()).to.equal(1n)
  })

  it("non owner revert", async function () {
    const signers = await ethers.getSigners()
    const attacker = signers[1]
    const DummyNft = await ethers.getContractFactory("DummyNft")
    const nft = await DummyNft.deploy()
    await nft.waitForDeployment()

    await expect(nft.connect(attacker).mint(attacker.address)).to.be.reverted
  })
})
