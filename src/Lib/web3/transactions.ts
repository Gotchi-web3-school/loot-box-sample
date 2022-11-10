import * as ethers from "ethers"

/**
 * @dev Deploy an instance of the standard chest
 * 
 * @notice It allow the owner to deposit any ERC20, 721, 1155 and be lootable by anyone
 * For a full tutorial follow the README => https://github.com/Gotchi-web3-school/Chest-standard
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The arguments of the function to be called
 * @param contractName Just for the console.log :p
 * @returns 
 */
export const deployTx = async(
  signer: ethers.Signer, 
  deployer: ethers.ContractFactory,
  args:  { [key: string]: any },
  contractName: string
  ): Promise<any> => {

  const contractFactory = deployer.connect(signer)

  try {  
    console.info("DEPLOY " + contractName.toUpperCase())
    console.log("///////////////////////////////////////////////")
    console.log("name: " + args.name)
    console.log("type: " + args.type)
    console.log("///////////////////////////////////////////////")

    
    const tx = await contractFactory.deploy(...Object.values(args))
      
      
    // TODO: Toast pop-up

    // tx.toast({
      //     title: `Add liquidity: ${tx.amount0.token.symbol} + ${tx.amount1.token.symbol}`,
      //     description: `transaction pending at: ${transaction.hash}`,
      //     position: "top-right",
      //     status: "loging",
      //     isClosable: true,
      //     })
      
      // const receipt = await transaction.wait()
      
      // tx.toast({
        //     title: `Add liquidity: ${tx.amount0.token.symbol} + ${tx.amount1.token.symbol}`,
        //     description: `Liquidity added successfully !`,
        //     position: "top-right",
        //     status: "success",
        //     duration: 6000,
        //     isClosable: true,
        //     })
          
      return tx 
          
        } catch (error: any) {
      console.log(error)
      // tx.toast({
        //     position: "bottom-right",
      //     title: 'An error occurred.',
      //     description: `Add Liquidity: ${error.message}`,
      //     status: 'error',
      //     duration: 9000,
      //     isClosable: true,
      //   })
  }
}





/**
 * @dev Deploy an instance of a ERC20 token
 * 
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The arguments of the function to be called
 * @returns 
 */
export const deployErc20Tx = async(
  signer: ethers.Signer, 
  deployer: ethers.ContractFactory,
  args:  { [key: string]: any },
  ): Promise<any> => {

  const contractFactory = deployer.connect(signer)

  try {  
    console.info("DEPLOY ERC20")
    console.log("///////////////////////////////////////////////")
    console.log("name: " + args.name)
    console.log("ticker: " + args.ticker)
    console.log("///////////////////////////////////////////////")

    
    const tx = await contractFactory.deploy(...Object.values(args))
      
    return tx 
          
    } catch (error: any) {
      console.log(error)
  }
}





/**
 * @dev Deploy an instance of a ERC20 token
 * 
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The arguments of the function to be called
 * @returns 
 */
export const deployErc721Tx = async(
  signer: ethers.Signer, 
  deployer: ethers.ContractFactory,
  args:  { [key: string]: any },
  ): Promise<any> => {

  const contractFactory = deployer.connect(signer)

  try {  
    console.info("DEPLOY ERC721")
    console.log("///////////////////////////////////////////////")
    console.log("name: " + args.name)
    console.log("ticker: " + args.ticker)
    console.log("///////////////////////////////////////////////")

    const tx = await contractFactory.deploy(...Object.values(args))
      
    return tx 
          
    } catch (error: any) {
      console.log(error)
  }
}





/**
 * @dev The addWhitelist function of the chest standard.
 * https://github.com/Gotchi-web3-school/Chest-standard/blob/3ac6e3a7ee29cb7fa88a45ceab0ebd99aff07761/contracts/Chest/extensions/ChestHolder.sol#L177
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The arguments of the function to be called
 * @returns the Tx sent
 */
export const addWhitelistTx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: string[]
  ) => {
  const contract = IContract.connect(signer)

  try {
    console.log("ADD WHITELIST")
    console.log("///////////////////////////////////////////////")
    console.log("tokens: ", args)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.addWhitelist(args)     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.addWhitelist(args)

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev The batchDeposit function of the chest standard.
 * https://github.com/Gotchi-web3-school/Chest-standard/blob/3ac6e3a7ee29cb7fa88a45ceab0ebd99aff07761/contracts/Chest/Chest.sol#L74
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The arguments of the function to be called
 * @returns the Tx sent
 */
export const batchDepositTx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: Array<string[]>
  ) => {
  const contract = IContract.connect(signer)

  try {
    console.log("BATCH DEPOSIT")
    console.log("///////////////////////////////////////////////")
    console.log("addresses: ", args[0])
    console.log("ids: ", args[1])
    console.log("amounts: ", args[2])
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.batchDeposit(...args)     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.batchDeposit(...args)

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev The transferOwnership function of openzeppelin.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The new owner of this chest
 * @returns the Tx sent
 */
export const transferOwnershipTx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: string
  ) => {
  const contract = IContract.connect(signer)

  try {
    console.log("BATCH DEPOSIT")
    console.log("///////////////////////////////////////////////")
    console.log("address: ", args)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.transferOwnership(args)     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.transferOwnership(args)     

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Approve an address to spend token.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The address to be approved
 * @returns the Tx sent
 */
export const approveERC20Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {
    const contract = IContract.connect(signer)
    

  try {
    console.log("APPROVE")
    console.log("///////////////////////////////////////////////")
    console.log("address: ", args.address)
    console.log("address: ", args.amount)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.approve(args.address, ethers.utils.parseEther(args.amount))     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.approve(args.address, ethers.utils.parseEther(args.amount))
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Approve an address to spend token.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The address to be approved
 * @returns the Tx sent
 */
export const approveERC721Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {
    const contract = IContract.connect(signer)
    

  try {
    console.log("APPROVE")
    console.log("///////////////////////////////////////////////")
    console.log("address: ", args.address)
    console.log("address: ", args.id)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.approve(args.address, args.id)     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.approve(args.address, args.id)
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Approve an address to manage a collection on behalf of the owner.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The address to be approved
 * @returns the Tx sent
 */
export const setApprovalForAllTx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: any }
  ) => {
    const contract = IContract.connect(signer)
    

  try {
    console.log("SET APPROVAL FOR ALL")
    console.log("///////////////////////////////////////////////")
    console.log("to: ", args.address)
    console.log("switch: ", args.switch)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.setApprovalForAllTx(args.to, args.switch)     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.setApprovalForAllTx(args.to, args.switch)
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Mint some token.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The amounts to be minted
 * @returns the Tx sent
 */
export const mintERC20Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {
    const contract = IContract.connect(signer)
    

  try {
    console.log("\t\t\tMINT")
    console.log("///////////////////////////////////////////////")
    console.log("to: ", args.address)
    console.log("amount: ", args.amount)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.mint(args.address, ethers.utils.parseEther(args.amount))     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.mint(args.address, ethers.utils.parseEther(args.amount))
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Mint some token.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The amounts to be minted
 * @returns the Tx sent
 */
export const safeMintERC721Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {
    const contract = IContract.connect(signer)
    

  try {
    console.log("\t\t\tMINT")
    console.log("///////////////////////////////////////////////")
    console.log("to: ", args.to)
    console.log("id: ", args.uri)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.safeMint(args.to, args.uri)     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.safeMint(args.to, args.uri)
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Mint some token.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The amounts to be minted
 * @returns the Tx sent
 */
export const transferERC20Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {

    const contract = IContract.connect(signer)

  try {
    console.log("\t\t\tTRANSFER")
    console.log("///////////////////////////////////////////////")
    console.log("address: ", args.address)
    console.log("address: ", args.amount)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.transfer(args.address, ethers.utils.parseEther(args.amount))     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.transfer(args.address, ethers.utils.parseEther(args.amount))
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Transfer a specific id of token ERC721.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args :
 * - address from
 * - address to
 * - uint token id
 * - string datas (optional)
 * 
 * @returns the Tx sent
 */
export const safeTransferFromErc721Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {

    const contract = IContract.connect(signer)
    console.log(contract)

  try {
    console.log("\tSAFE TRANSFER FROM")
    console.log("///////////////////////////////////////////////")
    console.log("from: ", args.from)
    console.log("to: ", args.to)
    console.log("id: ", args.id)
    console.log("datas: ", args.datas)
    console.log("///////////////////////////////////////////////")
    
    if (!args.datas) args.datas = "0x"
    // console.log(await Object.entries(contract.estimateGas)[12][1]())
    console.log(contract.estimateGas["safeTransferFrom(address,address,uint256,bytes)"])
    //Estimation of the gas cost
    const gas = await contract.estimateGas["safeTransferFrom(address,address,uint256,bytes)"](...Object.values(args))     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract["safeTransferFrom(address,address,uint256,bytes)"](...Object.values(args))    
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Burn some token.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The amounts to be minted
 * @returns the Tx sent
 */
export const burnERC20Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {
    const contract = IContract.connect(signer)
    

  try {
    console.log("\t\t\tBURN")
    console.log("///////////////////////////////////////////////")
    console.log("address: ", args.amount)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.burn(ethers.utils.parseEther(args.amount))     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.burn(ethers.utils.parseEther(args.amount))
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Burn some token.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The amounts to be minted
 * @returns the Tx sent
 */
export const burnERC721Tx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: string }
  ) => {
    const contract = IContract.connect(signer)
    

  try {
    console.log("\t\t\tBURN")
    console.log("///////////////////////////////////////////////")
    console.log("address: ", args.id)
    console.log("///////////////////////////////////////////////")
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.burn(args.id)     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.burn(args.id)
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}





/**
 * @dev Loot a specific token from the chest.
 * 
 * @param signer The user
 * @param IContract The contract to be interfaced with
 * @param args The token address, id & amount
 * @returns the Tx sent
 */
export const lootTx = async(
  signer: ethers.Signer,
  IContract: ethers.Contract,
  args: { [ key: string ]: any },
  type: number
  ) => {

    const contract = IContract.connect(signer)
    
  try {
    console.log("\t\t\tLOOT")
    console.log("///////////////////////////////////////////////")
    console.log("address: ", args.address)
    console.log("id: ", args.id)
    console.log("amount: ", args.amount)
    console.log("type: ", type)
    console.log("///////////////////////////////////////////////")
    
    // if token is ERC20 parse it to big number
    if (type === 1) args.amount = ethers.utils.parseEther(args.amount)
    
    //Estimation of the gas cost
    const gas = await contract.estimateGas.loot(...Object.values(args))     
    console.log("Gas cost: " + (ethers.utils.formatEther(gas?.toString() ?? "") + " MATIC"))
        
    const tx = await contract.loot(...Object.values(args))
    console.log("transaction sent !")

    return tx
      
  } catch (error: any) {
    console.log(error)
  }
}