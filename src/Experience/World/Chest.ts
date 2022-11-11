import * as THREE from "three";
import Experience from "../Experience";
import Resources from "../Utils/Resources";
import Materials from "../Utils/Materials";
import Raycaster from "../Utils/Raycaster";
import ChestItem from "./ChestItem";
import Sounds from "../Sounds";
import { BigNumberish } from "ethers";


export default class Chest {
  // Class
  experience: Experience
  raycaster: Raycaster
  scene: THREE.Scene
  resources: Resources
  materials: Materials
  time: THREE.Clock
  sounds: Sounds
  chestModel: any
  resource: any
  originX: number
  contracts: {[key: string]: any} = {}
  animation: {[key: string]: any} = {}
  audio: {[key: string]: any} = {}
  loots: ChestItem[] = []
  openOffset: number = 0
  openIndex: number = 0

  constructor() {
    this.experience = Experience.Instance()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.resource = this.resources.items.scene
    this.materials = this.experience.materials
    this.time = this.experience.root.clock
    this.sounds = this.experience.sounds
    this.chestModel = this.experience.world.lootBoxScene!.models.chestModel
    this.raycaster =  this.experience.raycaster
    this.originX = -2

    this.setGLTF()
    this.setAnimation()
  }

  setGLTF() {
    console.log("chestModel", this.chestModel)
  }

  setAnimation() 
  {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.chestModel)
    
    this.animation.action = {}
    this.animation.action.open = this.animation.mixer.clipAction(this.chestModel.animations[0])
    this.animation.action.current = this.animation.action.open
  }

  setLoots(items: {addresses: string[], ids: BigNumberish[], amounts: BigNumberish[], types: number[]}) {
    const chestItems: ChestItem[] = []
    for (let i = 0; i < items.addresses.length; i++) 
    {
      chestItems.push(

        new ChestItem(this, {
          address: items.addresses[i],
          id: items.ids[i],
          amount: items.amounts[i],
          type: items.types[i],
        })

      )
    }

    this.loots = chestItems

    for (const item of chestItems) 
    {
      item.mesh.position.x = -2
      item.mesh.position.y = 0.5
      item.mesh.scale.set(0.5, 0.5, 0.5)
    }

    this.openOffset = 1.3;
    this.openIndex = 0;
  }

  openAnimation() 
  {
    if (this.animation.action.current.paused) {
      if (this.openIndex < this.loots.length) {
        let finalPosition = (this.originX - (this.loots.length / 2) + this.openIndex + 0.5)
        let delta = finalPosition - this.originX
        if (this.openOffset - this.loots[this.openIndex].mesh.position.y > 0) {
          this.loots[this.openIndex].mesh.position.y += (this.time.getDelta() * 0.003);
          this.loots[this.openIndex].mesh.rotation.y += (this.time.getDelta() * 0.01);
          this.loots[this.openIndex].mesh.position.x = this.originX + (delta * (this.loots[this.openIndex].mesh.position.y / this.openOffset));
        }
        else {
          this.loots[this.openIndex].out = true;

          this.openIndex++;
        }
      }
      this.loots.forEach((loot: ChestItem) => loot.update())
    }
  }

  update() {
    this.animation.mixer.update(this.time.getDelta())
    this.openAnimation()
  }
}