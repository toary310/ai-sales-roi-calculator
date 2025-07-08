import { DUMMY_NFT_ABI, DUMMY_NFT_ADDRESS } from '@/lib/web3/mint-dummy-nft'
import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, createWalletClient, http, isAddress } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { polygonAmoy } from 'viem/chains'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json() as { address?: string }
    if (!address || !isAddress(address)) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    const rpcUrl = process.env.AMOY_RPC || process.env.NEXT_PUBLIC_AMOY_RPC
    if (!rpcUrl) {
      return NextResponse.json({ error: 'RPC URL not configured' }, { status: 500 })
    }

    const pk = process.env.PRIVATE_KEY
    if (!pk) {
      return NextResponse.json({ error: 'Server mint key not configured' }, { status: 500 })
    }

    const account = privateKeyToAccount(`0x${pk.replace(/^0x/, '')}`)

    const walletClient = createWalletClient({
      account,
      chain: polygonAmoy,
      transport: http(rpcUrl),
    })

    const publicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(rpcUrl),
    })

    // gas estimation
    const gas = await publicClient.estimateContractGas({
      address: DUMMY_NFT_ADDRESS,
      abi: DUMMY_NFT_ABI,
      functionName: 'mint',
      args: [address],
      account,
    })

    const hash = await walletClient.writeContract({
      address: DUMMY_NFT_ADDRESS,
      abi: DUMMY_NFT_ABI,
      functionName: 'mint',
      args: [address],
      gas,
    })

    return NextResponse.json({ hash })
  } catch (e: any) {
    console.error('Mint API error', e)
    return NextResponse.json({ error: e.message || 'internal error' }, { status: 500 })
  }
}
