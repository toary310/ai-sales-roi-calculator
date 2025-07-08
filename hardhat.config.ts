import "@nomicfoundation/hardhat-toolbox"
import { HardhatUserConfig } from "hardhat/config"
import { register } from "ts-node"
import "ts-node/register"

register({ project: "tsconfig.hardhat.json" })

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"
const MUMBAI_RPC = process.env.MUMBAI_RPC || "https://rpc.ankr.com/polygon_mumbai"

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    mumbai: {
      url: MUMBAI_RPC,
      accounts: PRIVATE_KEY !== "0x000..." ? [PRIVATE_KEY] : [],
    },
  },
}

export default config
