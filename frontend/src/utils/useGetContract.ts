import { Contract, ethers } from 'ethers'

import { VoteManagerContract } from '../../../backend/typechain'
import VoteManagerContractJson from '../../../backend/artifacts/contracts/VoteManagerContract.sol/VoteManagerContract.json'

export default function getContract(
  contractAddress: string
): VoteManagerContract {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(
    contractAddress,
    VoteManagerContractJson.abi,
    signer
  )
  return contract as VoteManagerContract
}
