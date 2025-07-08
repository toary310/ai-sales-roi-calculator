import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });   // ← 必ず最初に実行

import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import { register } from "ts-node";
import "ts-node/register";

register({ project: "tsconfig.hardhat.json" })

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"
const AMOY_RPC = process.env.AMOY_RPC || "https://rpc-amoy.polygon.technology"

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: AMOY_RPC,
      chainId: 80002,
      accounts: PRIVATE_KEY !== "0x000..." ? [PRIVATE_KEY] : [],
    },
  },
}

export default config
