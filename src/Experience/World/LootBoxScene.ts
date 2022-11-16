import * as THREE from "three";
import Experience from "../Experience";
import Resources  from "../Utils/Resources";
import Materials  from "../Utils/Materials";
import Contract   from "./Contract";

export default class LootBoxScene {
  // Class
  experience: Experience
  scene:      THREE.Scene
  resources:  Resources
  materials:  Materials

  // Models
  resource:   any
  contracts:  any
  floor:      any
  house:      any
  lamp:       any
  nature:     any
  steps:      any
  walls:      {[key: string]: any} = {}
  models:     {[key: string]: any} = {}

  // smart-contracts
  smartContracts: {[key: string]: any} = {}


  constructor() {
    this.experience = Experience.Instance()
    this.scene      = this.experience.scene
    this.materials  = this.experience.materials
    this.resources  = this.experience.resources

    this.parseModel()
    this.setMaterials()
    this.setSmartContract()

  }
  
  parseModel()
  {

    this.contracts            = this.resources.items.contractsModel.scene
    this.floor                = this.resources.items.floorModel.scene
    this.house                = this.resources.items.houseModel.scene
    this.lamp                 = this.resources.items.lampModel.scene
    this.nature               = this.resources.items.natureModel.scene
    this.steps                = this.resources.items.stepsModel.scene

    this.walls["wall1"]       = this.resources.items.wall1Model.scene
    this.walls["wall2"]       = this.resources.items.wall2Model.scene
    this.walls["wall3"]       = this.resources.items.wall3Model.scene
    this.walls["wall4"]       = this.resources.items.wall4Model.scene
    this.walls["wall5"]       = this.resources.items.wall5Model.scene
    this.walls["wall6"]       = this.resources.items.wall6Model.scene
    this.walls["wall7"]       = this.resources.items.wall7Model.scene
    this.walls["wall8"]       = this.resources.items.wall8Model.scene
    this.walls["wall9"]       = this.resources.items.wall9Model.scene
    this.walls["wall10"]      = this.resources.items.wall10Model.scene
    this.walls["wallDoor1"]   = this.resources.items.wallDoor1Model.scene
    this.walls["wallDoor2"]   = this.resources.items.wallDoor2Model.scene
    this.walls["wallOrigin"]  = this.resources.items.wallOriginModel.scene
    this.scene.add(this.floor, this.house, this.lamp, this.nature, this.steps, ...Object.values(this.walls))
    
    // Chest.sol
    this.models.chestSC = new THREE.Group()
    this.models.chestSC.name = "chestSC"
    this.models.chestSC.add(this.contracts.getObjectByName("contract_chest_function_deploy"))
    this.models.chestSC.add(this.contracts.getObjectByName("contract_chest_function_addWhitelist"))
    this.models.chestSC.add(this.contracts.getObjectByName("contract_chest_function_batchDeposit"))
    this.models.chestSC.add(this.contracts.getObjectByName("contract_chest_function_loot"))
    this.models.chestSC.add(this.contracts.getObjectByName("contract_chest_function_batchLoot"))
    this.models.chestSC.add(this.contracts.getObjectByName("contract_chest_function_transferOwnership"))
    this.models.chestSC.add(this.contracts.getObjectByName("chest_sol"))
    // this.models.chestSC.add(this.contracts.getObjectByName("chest_placeHolder"))
    this.models.chestSC.add(this.contracts.getObjectByName("chest_network"))
    this.models.chestSC.add(this.contracts.getObjectByName("chest_interface"))
    this.models.chestSC.add(this.contracts.getObjectByName("chest_inputsScreen"))
    this.models.chestSC.add(this.contracts.getObjectByName("chest_metaScreen"))
    this.models.chestSC.add(this.contracts.getObjectByName("contract_chest_function_import"))
    this.scene.add(this.models.chestSC)
    
    // erc20.sol
    this.models.erc20SC = new THREE.Group()
    this.models.erc20SC.name = "erc20SC"
    this.models.erc20SC.add(this.contracts.getObjectByName("contract_erc20_function_deploy"))
    this.models.erc20SC.add(this.contracts.getObjectByName("contract_erc20_function_approve"))
    this.models.erc20SC.add(this.contracts.getObjectByName("contract_erc20_function_transfer"))
    this.models.erc20SC.add(this.contracts.getObjectByName("contract_erc20_function_mint"))
    this.models.erc20SC.add(this.contracts.getObjectByName("contract_erc20_function_burn"))
    this.models.erc20SC.add(this.contracts.getObjectByName("contract_erc20_function_transferOwnership"))
    this.models.erc20SC.add(this.contracts.getObjectByName("erc20_sol"))
    // this.models.erc20SC.add(this.contracts.getObjectByName("erc20_placeHolder"))
    this.models.erc20SC.add(this.contracts.getObjectByName("erc20_network"))
    this.models.erc20SC.add(this.contracts.getObjectByName("erc20_interface"))
    this.models.erc20SC.add(this.contracts.getObjectByName("erc20_inputsScreen"))
    this.models.erc20SC.add(this.contracts.getObjectByName("erc20_metaScreen"))
    this.models.erc20SC.add(this.contracts.getObjectByName("contract_erc20_function_import"))
    this.scene.add(this.models.erc20SC)
    
    // erc721.sol
    this.models.erc721SC = new THREE.Group()
    this.models.erc721SC.name = "erc721SC"
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_deploy"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_approve"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_setApprovalForAll"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_safeTransferFrom"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_safeMint"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_burn"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_transferOwnership"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_renounceOwnership"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_8"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_9"))
    this.models.erc721SC.add(this.contracts.getObjectByName("erc721_sol"))
    // this.models.erc721SC.add(this.contracts.getObjectByName("erc721_placeHolder"))
    this.models.erc721SC.add(this.contracts.getObjectByName("erc721_network"))
    this.models.erc721SC.add(this.contracts.getObjectByName("erc721_interface"))
    this.models.erc721SC.add(this.contracts.getObjectByName("erc721_inputsScreen"))
    this.models.erc721SC.add(this.contracts.getObjectByName("erc721_metaScreen"))
    this.models.erc721SC.add(this.contracts.getObjectByName("contract_erc721_function_import"))
    this.scene.add(this.models.erc721SC)
    
    // erc1155.sol
    this.models.erc1155SC = new THREE.Group()
    this.models.erc1155SC.name = "erc1155SC"
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_deploy"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_setApprovalForAll"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_safeTransferFrom"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_safeBatchTransferFrom"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_mint"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_mintBatch"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_burn"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_burnBatch"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_transferOwnership"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_renounceOwnership"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("erc1155_sol"))
    // this.models.erc1155SC.add(this.contracts.getObjectByName("erc1155_placeHolder"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("erc1155_network"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("erc1155_interface"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("erc1155_inputsScreen"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("erc1155_metaScreen"))
    this.models.erc1155SC.add(this.contracts.getObjectByName("contract_erc1155_function_import"))
    
    this.scene.add(this.models.erc1155SC)

    // Models
    this.models.clickMe = this.contracts.getObjectByName("clickMe")
    this.models.grass   = this.floor.getObjectByName("forest_ground")
    this.models.road    = this.floor.getObjectByName("road")

    this.scene.add(this.contracts)
  }

  setMaterials()
  {
    this.resources.on("texturesMapped", () => 
    {
      this.lamp.getObjectByName('poleLights').children[0].intensity = 0.4
      this.lamp.getObjectByName('poleLights').children[1].intensity = 0.4
      
      this.lamp.traverse(child => child.isMesh ? child.material.toneMapped = false : "")
      this.contracts.traverse(child => child.isMesh ? child.material.toneMapped = false : "")
      this.steps.traverse(child => child.isMesh ? child.material.toneMapped = false : "")


      this.models.chestSC.children[0].material  = this.materials.items.deployContract
      this.models.chestSC.children[1].material  = this.materials.items.addWhitelist
      this.models.chestSC.children[2].material  = this.materials.items.deposit
      this.models.chestSC.children[3].material  = this.materials.items.loot
      this.models.chestSC.children[4].material  = this.materials.items.batchLoot
      this.models.chestSC.children[5].material  = this.materials.items.transferOwnership
      this.models.chestSC.children[9].visible   = false
      this.models.chestSC.children[10].visible  = false
      this.models.chestSC.children[11].material = this.materials.items.import
      this.models.chestSC.getObjectByName("chest_network").material = this.materials.items.contractInterfaceMaterial
      this.models.chestSC.getObjectByName("chest_interface").material = this.materials.items.contractInterfaceMaterial
      this.models.chestSC.getObjectByName("chest_inputsScreen").material = this.materials.items.contractInterfaceMaterial
      this.models.chestSC.getObjectByName("chest_metaScreen").material = this.materials.items.contractInterfaceMaterial

      this.models.erc20SC.children[0].material  = this.materials.items.deployContract
      this.models.erc20SC.children[1].material  = this.materials.items.approveErc20
      this.models.erc20SC.children[2].material  = this.materials.items.transferErc20
      this.models.erc20SC.children[3].material  = this.materials.items.mintErc20
      this.models.erc20SC.children[4].material  = this.materials.items.burnErc20
      this.models.erc20SC.children[5].material  = this.materials.items.transferOwnership
      this.models.erc20SC.children[9].visible   = false
      this.models.erc20SC.children[10].visible  = false
      this.models.erc20SC.children[11].material = this.materials.items.import
      this.models.erc20SC.getObjectByName("erc20_network").material = this.materials.items.contractInterfaceMaterial
      this.models.erc20SC.getObjectByName("erc20_interface").material = this.materials.items.contractInterfaceMaterial
      this.models.erc20SC.getObjectByName("erc20_inputsScreen").material = this.materials.items.contractInterfaceMaterial
      this.models.erc20SC.getObjectByName("erc20_metaScreen").material = this.materials.items.contractInterfaceMaterial

      this.models.erc721SC.children[0].material = this.materials.items.deployContract
      this.models.erc721SC.children[1].material = this.materials.items.approveErc721
      this.models.erc721SC.children[2].material = this.materials.items.approveAllErc721
      this.models.erc721SC.children[3].material = this.materials.items.transferErc721
      this.models.erc721SC.children[4].material = this.materials.items.mintErc721
      this.models.erc721SC.children[5].material = this.materials.items.burnErc721
      this.models.erc721SC.children[6].material = this.materials.items.transferOwnership
      // this.models.erc721SC.children[7].material.visible = false
      // this.models.erc721SC.children[8].material.visible = false
      this.models.erc721SC.children[9].material.visible = false
      this.models.erc721SC.children[13].visible = false
      this.models.erc721SC.children[14].visible = false
      this.models.erc721SC.children[15].material = this.materials.items.import
      this.models.erc721SC.getObjectByName("erc721_network").material = this.materials.items.contractInterfaceMaterial
      this.models.erc721SC.getObjectByName("erc721_interface").material = this.materials.items.contractInterfaceMaterial
      this.models.erc721SC.getObjectByName("erc721_inputsScreen").material = this.materials.items.contractInterfaceMaterial
      this.models.erc721SC.getObjectByName("erc721_metaScreen").material = this.materials.items.contractInterfaceMaterial

      this.models.erc1155SC.children[0].material = this.materials.items.deployContract
      this.models.erc1155SC.children[1].material = this.materials.items.approveAllErc1155
      this.models.erc1155SC.children[2].material = this.materials.items.transferErc1155
      this.models.erc1155SC.children[3].material = this.materials.items.batchTransferErc1155
      this.models.erc1155SC.children[4].material = this.materials.items.mintErc1155
      this.models.erc1155SC.children[5].material = this.materials.items.batchMintErc1155
      this.models.erc1155SC.children[6].material = this.materials.items.burnErc1155
      this.models.erc1155SC.children[7].material = this.materials.items.batchBurnErc1155
      this.models.erc1155SC.children[8].material = this.materials.items.transferOwnership
      // this.models.erc1155SC.children[9].material.visible = false
      this.models.erc1155SC.children[13].visible = false
      this.models.erc1155SC.children[14].visible = false
      this.models.erc1155SC.children[15].material = this.materials.items.import
      this.models.erc1155SC.getObjectByName("erc1155_network").material = this.materials.items.contractInterfaceMaterial
      this.models.erc1155SC.getObjectByName("erc1155_interface").material = this.materials.items.contractInterfaceMaterial
      this.models.erc1155SC.getObjectByName("erc1155_inputsScreen").material = this.materials.items.contractInterfaceMaterial
      this.models.erc1155SC.getObjectByName("erc1155_metaScreen").material = this.materials.items.contractInterfaceMaterial

      // grass
      this.models.grass.material.map.repeat = new THREE.Vector2(2, 3)
      this.models.grass.material.wrapS = THREE.RepeatWrapping
      this.models.grass.material.wrapT = THREE.RepeatWrapping
      
    })
  }

  setSmartContract()
  {
    this.resources.on("texturesMapped", () => 
    {
      this.smartContracts.chest    = new Contract( this.resources.items.chestAbi.abi,     this.models.chestSC,    this.resources.items.chestAbi.bytecode   )
      this.smartContracts.erc20    = new Contract( this.resources.items.erc20Abi.abi,     this.models.erc20SC,    this.resources.items.erc20Abi.bytecode   )
      this.smartContracts.erc721   = new Contract( this.resources.items.erc721Abi.abi,    this.models.erc721SC,   this.resources.items.erc721Abi.bytecode  )
      this.smartContracts.erc1155  = new Contract( this.resources.items.erc1155Abi.abi,   this.models.erc1155SC,  this.resources.items.erc1155Abi.bytecode )
    })
  }

  update() 
  {
    for( const contract of Object.values(this.smartContracts) ) { contract.update() }
  }
}