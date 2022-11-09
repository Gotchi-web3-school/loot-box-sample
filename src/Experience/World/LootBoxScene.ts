import * as THREE from "three";
import Experience from "../Experience";
import Resources from "../Utils/Resources";
import Materials from "../Utils/Materials";
import Contract from "./Contract";

export default class LootBoxScene {
  // Class
  experience: Experience
  scene: THREE.Scene
  resources: Resources
  materials: Materials
  resource: any
  model: any
  models: {[key: string]: any} = {}
  contracts: {[key: string]: any} = {}

  constructor() {
    this.experience = Experience.Instance()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.resource = this.resources.items.scene
    this.materials = this.experience.materials

    this.parseModel()
    this.setMaterials()
    this.setSmartContract()
  }
  
  parseModel()
  {
    this.model = this.resource.scene
    // Smart contracts
    // Chest.sol
    this.models.chestSC = new THREE.Group()
    this.models.chestSC.name = "chestSC"
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "contract_chest_function_deploy"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "contract_chest_function_addWhitelist"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "contract_chest_function_batchDeposit"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "contract_chest_function_loot"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "contract_chest_function_batchLoot"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "contract_chest_function_transferOwnership"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "chest_sol"))
    // this.models.chestSC.add(this.model.children.find((child: any) => child.name === "chest_placeHolder"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "chest_network"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "chest_interface"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "chest_inputsScreen"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "chest_metaScreen"))
    this.models.chestSC.add(this.model.children.find((child: any) => child.name === "contract_chest_function_import"))
    this.scene.add(this.models.chestSC)
    
    // erc20.sol
    this.models.erc20SC = new THREE.Group()
    this.models.erc20SC.name = "erc20SC"
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "contract_erc20_function_deploy"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "contract_erc20_function_approve"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "contract_erc20_function_transfer"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "contract_erc20_function_mint"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "contract_erc20_function_burn"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "contract_erc20_function_transferOwnership"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "erc20_sol"))
    // this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "erc20_placeHolder"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "erc20_network"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "erc20_interface"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "erc20_inputsScreen"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "erc20_metaScreen"))
    this.models.erc20SC.add(this.model.children.find((child: any) => child.name === "contract_erc20_function_import"))
    this.scene.add(this.models.erc20SC)
    
    // erc721.sol
    this.models.erc721SC = new THREE.Group()
    this.models.erc721SC.name = "erc721SC"
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_deploy"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_approve"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_setApprovalForAll"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_safeTransferFrom"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_safeMint"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_burn"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_transferOwnership"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_renounceOwnership"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_8"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_9"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "erc721_sol"))
    // this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "erc721_placeHolder"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "erc721_network"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "erc721_interface"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "erc721_inputsScreen"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "erc721_metaScreen"))
    this.models.erc721SC.add(this.model.children.find((child: any) => child.name === "contract_erc721_function_import"))
    this.scene.add(this.models.erc721SC)
    
    // erc1155.sol
    this.models.erc1155SC = new THREE.Group()
    this.models.erc1155SC.name = "erc1155SC"
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_deploy"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_setApprovalForAll"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_safeTransferFrom"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_safeBatchTransferFrom"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_mint"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_mintBatch"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_burn"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_burnBatch"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_transferOwnership"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_renounceOwnership"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "erc1155_sol"))
    // this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "erc1155_placeHolder"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "erc1155_network"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "erc1155_interface"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "erc1155_inputsScreen"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "erc1155_metaScreen"))
    this.models.erc1155SC.add(this.model.children.find((child: any) => child.name === "contract_erc1155_function_import"))
    
    this.scene.add(this.models.erc1155SC)

    // Models
    this.models.chestModel = this.model.children.find((child: any) => child.name === "chest")
    this.models.clickMe = this.model.children.find((child: any) => child.name === "clickMe")
    this.models.grass = this.model.children.find((child: any) => child.name === "grass")
    this.models.road = this.model.children.find((child: any) => child.name === "road")
    
    // this.experience.root["contractFunctions"].traverse((child: any, index: any) => {
    //   child.visible = false 
    // })
    this.scene.add(this.model)
  }

  setMaterials()
  {
    this.resources.on("texturesMapped", () => {
      this.models.chestSC.children[0].material = this.materials.items.deployContract
      this.models.chestSC.children[1].material = this.materials.items.addWhitelist
      this.models.chestSC.children[2].material = this.materials.items.deposit
      this.models.chestSC.children[3].material = this.materials.items.loot
      this.models.chestSC.children[4].material = this.materials.items.batchLoot
      this.models.chestSC.children[5].material = this.materials.items.transferOwnership
      this.models.chestSC.children[9].visible = false
      this.models.chestSC.children[10].visible = false
      this.models.chestSC.children[11].material = this.materials.items.import

      this.models.erc20SC.children[0].material = this.materials.items.deployContract
      this.models.erc20SC.children[1].material = this.materials.items.approveErc20
      this.models.erc20SC.children[2].material = this.materials.items.transferErc20
      this.models.erc20SC.children[3].material = this.materials.items.mintErc20
      this.models.erc20SC.children[4].material = this.materials.items.burnErc20
      this.models.erc20SC.children[5].material = this.materials.items.transferOwnership
      this.models.erc20SC.children[9].visible = false
      this.models.erc20SC.children[10].visible = false
      this.models.erc20SC.children[11].material = this.materials.items.import

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
      this.contracts.chest = new Contract(this.resources.items.chestAbi.abi, this.models.chestSC, this.resources.items.chestAbi.bytecode)
      this.contracts.erc20 = new Contract(this.resources.items.erc20Abi.abi, this.models.erc20SC, this.resources.items.erc20Abi.bytecode)
      this.contracts.erc721 = new Contract(this.resources.items.erc721Abi.abi, this.models.erc721SC, this.resources.items.erc721Abi.bytecode)
      this.contracts.erc1155 = new Contract(this.resources.items.erc1155Abi.abi, this.models.erc1155SC, this.resources.items.erc1155Abi.bytecode)

    })
  }

  update() {
    const contracts = Object.entries(this.contracts)
    for(let i = 0; i < contracts.length; i++)
      this.contracts[contracts[i][0]].update()
  }
}