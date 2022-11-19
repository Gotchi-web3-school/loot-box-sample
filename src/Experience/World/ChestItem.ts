import * as THREE from "three";
import Experience from "../Experience";
import Resources from "../Utils/Resources";
import Materials from "../Utils/Materials";
import { ethers, BigNumberish } from "ethers";
import Chest from "./Chest";
import Factory from "../Utils/Factory"

type Loot = {
  index: number
  address: string
  id: BigNumberish
  amount: BigNumberish
  type: number
}

const interfaceType = {
  "1": "erc20",
  "2": "erc721",
  "3": "erc1155",
}

export default class ChestItem {
   // Class
   experience: Experience
   factory: Factory
   chest: Chest
   time: THREE.Clock
   item: Loot
   scene: THREE.Scene

   out: boolean = false
   resources: Resources
   materials: Materials
   contract: ethers.Contract
   mesh?: THREE.Group

  constructor(chest: Chest, item: Loot) {
    this.experience = Experience.Instance()
    this.factory = this.experience.factory
    this.chest = chest
    this.time = this.experience.root.clock
    this.item = item
    this.resources = this.experience.resources
    this.materials = this.experience.materials
    this.scene = this.experience.scene

    let abi = this.resources.items[`${interfaceType[item.type]}Abi`].abi
    this.contract = new ethers.Contract(item.address, abi, this.experience.world.user?.wallet.signer)

    this.setMesh(item)
  }

  async setMesh(item: Loot)
  {
    let name;

    if (item.type !== 3) name = await this.contract.symbol()

    switch(item.type) 
    {
      case 1:
        this.mesh = this.factory.createErc20Mesh(item.address, name)
        this.mesh.position.copy(this.chest.chestModel.scene.position)
      break
        
      case 2:
        this.mesh = this.factory.createErc721Mesh(item.address, name, item.id.toString())
        this.mesh.position.copy(this.chest.chestModel.scene.position)
      break

      case 3:
        this.mesh = this.factory.createErc1155Mesh(item.address, name, item.id.toString())
        this.mesh.position.copy(this.chest.chestModel.scene.position)
      break

      default:
        console.error("Error with the type of item");
        return (1);
    }

    this.mesh.name = `chest_${this.item.index}_chestItem` 
    this.scene.add(this.mesh)
  }

  update() {
    if (this.out) {
      this.mesh!.position.y = Math.cos(Math.sin(-this.chest.time.getElapsedTime())) + this.chest.openYaxisOffset
      this.mesh!.rotation.y = this.chest.time.getElapsedTime()
    }
  }
}