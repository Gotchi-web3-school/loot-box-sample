import * as THREE         from "three";
import { BigNumberish }   from "ethers";
import Contract           from "./Contract";
import ChestItem          from "./ChestItem";
import Experience         from "../Experience";
import Resources          from "../Utils/Resources";
import Materials          from "../Utils/Materials";
import Raycaster          from "../Utils/Raycaster";
import Sounds             from "../Sounds";


export default class Chest {
  // Class
  experience: Experience
  raycaster: Raycaster
  scene: THREE.Scene
  resources: Resources
  materials: Materials
  time: THREE.Clock
  sounds: Sounds

  // Scene
  chestModel: any
  chestScene: THREE.Group
  resource: any
  originX: number = -2
  animation: {[key: string]: any} = {}
  openOffset: number = 1.3
  openIndex: number = 0
  
  // blockchain
  contract?: Contract
  loots: ChestItem[] = []

  constructor() 
  {
    this.experience = Experience.Instance()
    this.raycaster  = this.experience.raycaster
    this.scene      = this.experience.scene
    this.resources  = this.experience.resources
    this.materials  = this.experience.materials
    this.time       = this.experience.root.clock
    this.sounds     = this.experience.sounds

    this.chestModel = this.resources.items.chestModel
    this.chestScene = this.chestModel.scene
    this.resource   = this.resources.items.scene

    this.setGLTF()
    this.setAnimation()
    this.setEvent()
  }

  setGLTF() 
  {
    this.chestModel.scene.position.copy(new THREE.Vector3(1.64, 0, 8.76))
    this.chestModel.scene.rotation.y = -(Math.PI * 0.25)
    this.scene.add(this.chestModel.scene)
  }

  setAnimation() 
  {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.chestModel.scene)
    
    this.animation.action = {}
    this.animation.action.open = this.animation.mixer.clipAction(this.chestModel.animations[0])
    this.animation.action.current = this.animation.action.open
  }

  setEvent()
  {
    this.raycaster.on("clickChest", () => 
    {
      let action = this.animation.action.current
      let open = this.sounds.openChest
      let close = this.sounds.closeChest
      let loots = this.loots

      if (action.paused) 
      {
        action.paused = false
        close.play()

        setTimeout(() => action.stop(), 500)
        
        for(const loot of loots) {
          loot.mesh.position.set(-2, 0.5, 0)
          loot.out = false
        }
        this.openIndex = 0;
      }
      else 
      {
        action.play()
        open.play()
        setTimeout(() => action.paused = true, 500)
      }
    })

  }

  setLoots(items: {addresses: string[], ids: BigNumberish[], amounts: BigNumberish[], types: number[]}) 
  {
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
  }

  openAnimation() 
  {
    if (this.animation.action.current.paused) 
    {
      // loots displacement when user open the chest
      if (this.openIndex < this.loots.length) 
      {
        let finalPosition = ( this.originX - ( this.loots.length / 2 ) + this.openIndex + 0.5 )
        let delta = finalPosition - this.originX

        if ( this.openOffset - this.loots[this.openIndex].mesh.position.y > 0 ) 
        {
          this.loots[this.openIndex].mesh.position.y += (this.time.getDelta() * 0.003);
          this.loots[this.openIndex].mesh.rotation.y += (this.time.getDelta() * 0.01);
          this.loots[this.openIndex].mesh.position.x = this.originX + (delta * (this.loots[this.openIndex].mesh.position.y / this.openOffset));
        }
        else 
        {
          this.loots[this.openIndex].out = true;

          this.openIndex++;
        }
      }
      this.loots.forEach((loot: ChestItem) => loot.update())
    }
  }

  update() 
  {
    this.animation.mixer.update(this.time.getDelta() * 50)
    this.openAnimation()
  }
}