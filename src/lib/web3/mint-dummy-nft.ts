export const DUMMY_NFT_ADDRESS = "0x2EbB18d12942e9B51b944Bf37f080e22151553a2" as const

// DummyNft contract ABI (minimal)
export const DUMMY_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const
