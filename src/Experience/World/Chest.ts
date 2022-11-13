import * as THREE         from "three";
import { BigNumberish }   from "ethers";
import Contract           from "./Contract";
import ChestItem          from "./ChestItem";
import Experience         from "../Experience";
import Resources          from "../Utils/Resources";
import Materials          from "../Utils/Materials";
import Raycaster          from "../Utils/Raycaster";
import Sounds             from "../Sounds";
import PreLoader          from "../PreLoader";


export default class Chest {
  // Class
  experience: Experience
  raycaster: Raycaster
  scene: THREE.Scene
  resources: Resources        
  preLoader: PreLoader
  materials: Materials
  time: THREE.Clock
  sounds: Sounds

  // Scene
  chestModel: any
  chestScene: THREE.Group
  resource: any
  originX: number = 0
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
    this.preLoader  = this.experience.preLoader 
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
    this.originX = this.chestModel.scene.position.x

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
          loot.mesh!.position.copy(this.chestScene.position)
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

    this.preLoader.on("start", () => {

      this.contract = this.experience.world.lootBoxScene?.contracts.chest

      this.experience.world.lootBoxScene?.contracts.chest.on("import chest", async () => {
        const IContract = this.contract!.interface!.connect(this.experience.world.user?.wallet.signer)
        const loots = await IContract.callStatic.look()
        this.setLoots(loots)
      })

    })


  }

  setLoots(loots: {items: string[], tokenIds: BigNumberish[], amounts: BigNumberish[], type_: number[]}) 
  {
    const chestItems: ChestItem[] = []
    for (let i = 0; i < loots.items.length; i++) 
    {
      chestItems.push(

        new ChestItem(this, {
          address: loots.items[i],
          id: loots.tokenIds[i],
          amount: loots.amounts[i],
          type: loots.type_[i],
        })

      )
    }

    this.loots = chestItems

    // for (const item of chestItems) 
    // {
    //   item.mesh.position.x = -2
    //   item.mesh.position.y = 0.5
    //   item.mesh.scale.set(0.5, 0.5, 0.5)
    // }
  }

  refreshLoots()
  {

  }

  openAnimation() 
  {
    if (this.animation.action.current.paused) 
    {
      // calcul each loot displacement & final position when openning the chest
      if (this.openIndex < this.loots.length) 
      {
        let finalPosition = ( this.originX - ( this.loots.length / 2 ) + this.openIndex + 0.5 )
        let delta = finalPosition - this.originX
        
        // 1. Animation during the openning of chest
        if ( this.openOffset - this.loots[this.openIndex].mesh!.position.y > 0 ) 
        {
          this.loots[this.openIndex].mesh!.position.y += (this.time.getDelta() * 400);
          this.loots[this.openIndex].mesh!.rotation.y = this.time.getElapsedTime() * 5
          this.loots[this.openIndex].mesh!.position.x = this.originX + (delta * (this.loots[this.openIndex].mesh!.position.y / this.openOffset));
        }
        else 
        {
          // 2. Once the item is at his final position go to the next one
          this.loots[this.openIndex].out = true;

          this.openIndex++;
        }
      }
      // 3. Animaton once all the item has been set up hovering above the chest
      this.loots.forEach((loot: ChestItem) => loot.update())
    }
  }

  update() 
  {
    this.animation.mixer.update(0.02)
    this.openAnimation()
  }
}