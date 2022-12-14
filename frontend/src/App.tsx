import { Contract, ethers } from 'ethers'
import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Box, Container, Grid, Stack, styled, Typography } from '@mui/material'

import { VoteManagerContract } from '../../backend/typechain'
import { ipfsService } from '../services/ipfsService'
// import { CandidateCard } from "./components/CandidateCard";
import getContract from './utils/useGetContract'

function App() {
  /*-----------STATES---------------*/
  // const [typedContract, setTypedContract] = useState<ExampleContract>()
  const [contract, setContract] = useState<VoteManagerContract>()
  const [selectedImage, setSelectedImage] = useState()
  const [candidates, setCandidates] = useState([])
  const [candidateFormData, setCandidateFormData] = useState({
    name: '',
    imageHash: ''
  })
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  useEffect(() => {
    if (contract === undefined) {
      setContract(getContract(contractAddress))
      // const testAuth = async () => {
      //   await ipfsService.testAuthentication()
      // }
      // testAuth()
    }
  }, [contract])

  useEffect(() => {
    if (contract) {
      getAllCandidates()
      contract.on('Voted', async function () {
        getAllCandidates()
      })

      contract.on('candidateCreated', async function () {
        getAllCandidates()
      })
    }
  }, [contract])

  const IPFSUploadHandler = async (): Promise<string> => {
    const resp = await ipfsService.pinFileToIPFS(selectedImage)
    if (!resp.data.IpfsHash) throw Error('no IPFS Hash')
    return `https://gateway.pinata.cloud/ipfs/${resp.data.IpfsHash}`
  }

  async function registerCandidate() {
    const name = candidateFormData.name // get the name from formdata
    const ipfsImageHash = await IPFSUploadHandler() // getting the IPFS Image Hash from the Pinata API Service

    contract?.registerCandidate(name, ipfsImageHash) // call the VoteManager registerCandidate Contract Function
  }

  function vote(address: string) {
    if (!address) {
      throw Error('no address defined')
    }
    contract?.vote(address)
  }

  async function getAllCandidates() {
    // const retrievedCandidates = await contract?.fetchCandidates()
    // const tempArray = []
    // retrievedCandidates.forEach((candidate) => {
    //   tempArray.push({
    //     id: candidate.id,
    //     name: candidate.name,
    //     totalVote: candidate.totalVote,
    //     imageHash: candidate.imageHash,
    //     candidateAddress: candidate.candidateAddress
    //   })
    // })
    // setCandidates(tempArray)
  }

  const handleChange = (event: any) => {
    setCandidateFormData((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    })
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mv: '2rem' }}>
        <Box component="form">
          <Stack direction="row" alignItems="center" spacing={2} mb={4}>
            <TextField
              id="filled-basic"
              label="Name"
              variant="filled"
              name="name"
              value={candidateFormData.name}
              onChange={handleChange}
            />
            <label htmlFor="contained-button-file">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target?.files[0])}
              />
            </label>

            <Button
              variant="contained"
              component="span"
              onClick={() => registerCandidate()}
            >
              Register as Candidate
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  )
}

export default App
