import * as THREE from "three";
import Experience from "../Experience";
import Resources from "../Utils/Resources";
import Materials from "../Utils/Materials";
import { ethers, BigNumberish } from "ethers";
import { interfaces } from "../../Lib/web3/interfaces";
import Chest from "./Chest";
import Factory from "../Utils/Factory"

type Loot = {
  address: string
  id: BigNumberish
  amount: BigNumberish
  type: number
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
   mesh: THREE.Mesh

  constructor(chest: Chest, item: Loot) {
    this.experience = Experience.Instance()
    this.factory = this.experience.factory
    this.chest = chest
    this.time = this.experience.root.clock
    this.item = item
    this.resources = this.experience.resources
    this.materials = this.experience.materials
    this.scene = this.experience.scene
    this.contract = new ethers.Contract(item.address, interfaces[item.type], this.experience.world.user?.wallet.signer)

    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
  }

  update() {
    if (this.out) {
      this.mesh.position.y = Math.cos(Math.sin(-this.chest.time.elapsedTime * 0.001)) + this.chest.openOffset
      this.mesh.rotation.y = this.chest.time.elapsedTime * 0.001
    }
  }
}