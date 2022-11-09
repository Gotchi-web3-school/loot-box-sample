import { useRef, useState } from "react"
import { Html } from "@react-three/drei"
import Experience from "../Experience/Experience"
import { useForm } from "react-hook-form";
import { ChakraProvider, FormLabel, Input, Box, Stack, Text, Button, Spacer, HStack } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Contract from "../Experience/World/Contract";
// import { lootTx } from "../Lib/web3/transactions";

const Loot: React.FC<{group: string, experience: Experience}> = ({ group, experience }) => {





  /***********************************|
  |              HOOKS                |
  |__________________________________*/

  const { user } = experience.world
  const [contract, setContract] = useState<Contract>()
  const [mode, setCurrMode] = useState<string | undefined>()
  const [loots, setLoots] = useState<any[]>([])
  const [connected, setConnected] = useState<boolean>()
  const lootRef = useRef<any>()
  const { register, handleSubmit, formState: { errors } } = useForm();





  /***********************************|
  |            FUNCTIONS              |
  |__________________________________*/

  const onSubmit = async (data) => {
    // const tx = await lootTx(user?.wallet.signer, contract?.interface!, args)
    // contract!.handleTxs(tx)
  };
  




  /***********************************|
  |             EVENTS                |
  |__________________________________*/

  experience.raycaster.on( "click_contract_chest_function_loot", async () => { 
    setCurrMode(experience.controller.getCurrentMode())
    setContract(experience.world.lootBoxScene!.contracts[group])
    setConnected(experience.world.user!.wallet.isConnected)

    console.log(await contract!.interface!.callStatic.look())
    setLoots(await contract!.interface!.callStatic.look())
  })

  



  /***********************************|
  |            EXPERIENCE             |
  |__________________________________*/

  return (
    <mesh ref={lootRef} name={group + " loot"} scale={0.6} position={ [0, -1, 0] }  >

      {mode === "inputsScreen" &&
          <Html
            distanceFactor={5}
            position={ [ 0, 1.66, 0 ] }
            rotation={ [ 0, Math.PI * 0.206, 0 ] }
            transform
          >
            <ChakraProvider>
              <Box border={"1px solid #9ecaed"}  overflowY="auto" width="268px" height={"268px"} padding="1rem" borderRadius={"32px"} textAlign="center" textColor={'white'} boxShadow={"inset 0 0 20px #9ecaed, 0 0 20px #9ecaed"}>
                <Box>
                  <Text pb="0.5rem" fontWeight={"bold"} sx={{fontSize: "1rem"}} >Batch deposit</Text>
                  <Box as="button" fontSize={"10px"} position={"fixed"} top="20px" right="20px" onClick={() =>{
                    experience.controller.chestContractControls.main()
                    setCurrMode(experience.controller.getCurrentMode())
                  }}
                  >
                    Back <ChevronRightIcon />
                  </Box>
                </Box>


                <Stack alignItems={"left"} mt="1rem" spacing={"1rem"}>
                  <Box mb="1rem">
                    <FormLabel  m="0" width="3.7rem" position={"relative"}top="-1" left="5" overflow={"hidden"} >Batch 1</FormLabel>
                    <Box border="0.01rem solid white" borderRadius={"xl"} textAlign="left" p="0.5rem">
                      <Box >
                        <Text fontSize={"xs"}>Address</Text>
                        <Input  disabled={!loots.length} _hover={{boxShadow:"inset 0 0 2px white, 0 0 2px white"}} fontSize="8px" border="none" padding="0.3rem" placeholder="0x..." size="sm" borderRadius={"5px"} {...register("address1", {required: true, maxLength: 42, minLength: 42, pattern: /^0x[A-Fa-f0-9]{40}$/i})} />
                        {errors.address1?.type === "pattern" && <Text color="red" fontSize="6px">Address must start with "0x" and follow by 40 "Aa-Ff" and/or "0-9"<br />example: 0x0A2b6922FcFF343D51efB4bE45CFBA5Cd7aa08B6</Text>}
                        {errors.address1?.type === "required" && <Text color="red" fontSize="10px">Address is required</Text>}
                        {(errors.address1?.type === "minLength" || errors.address1?.type === "maxLength") && <Text color="red" fontSize="10px">Address must be 42 long</Text>}
                      </Box>
                      <HStack mt="1rem" alignItems={"center"}>
                          <Text fontSize={"xs"}>Id</Text>
                          <Input  disabled={!loots.length} _hover={{boxShadow:"inset 0 0 2px white, 0 0 2px white"}} border="none" type="number" min="0" maxW="20%" fontSize="8px" padding="0.3rem" placeholder="0" size="sm" borderRadius={"5px"} {...register("id1", {required: true})} />
                          {errors.id1?.type === "required" && <Text textAlign={"center"} color="red" fontSize="10px">Id is required</Text>}
                          <Spacer />
                          <Text fontSize={"xs"}>Amount</Text>
                          <Input  disabled={!loots.length} _hover={{boxShadow:"inset 0 0 2px white, 0 0 2px white"}} border="none" type="number" min="0" maxW="20%" fontSize="8px" padding="0.3rem" placeholder="3" size="sm" borderRadius={"5px"} {...register("amount1", {required: true})} />
                          {errors.amount1?.type === "required" && <Text textAlign={"center"} color="red" fontSize="10px">Amount is required</Text>}
                      </HStack>
                    </Box>
                  </Box>

                  
                  { connected ?
                    <Button disabled={!loots.length} onClick={handleSubmit(onSubmit)} alignSelf="center" mt="3rem !important" maxH="2rem" maxW="5rem" px="0.5rem" borderRadius="0.2rem" bg="blue.500">Send Tx</Button>
                    :
                    <Button onClick={() => { user?.wallet.connect().then((result) => setConnected(result)) }} alignSelf="center" mt="3rem !important" maxH="2rem" maxW="5rem" px="0.5rem" borderRadius="0.2rem" bg="orange" >Connect</Button>
                  }

                </Stack>
              </Box>
            </ChakraProvider>

          </Html>


      }

    </mesh>
  )
}

export default Loot