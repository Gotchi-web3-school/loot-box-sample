import * as THREE         from "three";
import { BigNumberish }   from "ethers";
import { RootState }      from "@react-three/fiber";
import Contract           from "./Contract";
import ChestItem          from "./ChestItem";
import Experience         from "../Experience";
import Resources          from "../Utils/Resources";
import Materials          from "../Utils/Materials";
import Raycaster          from "../Utils/Raycaster";
import Sounds             from "../Sounds";
import PreLoader          from "../PreLoader";
import { Vector3 } from "three";


export default class Chest {
  // Class
  experience: Experience
  root: RootState
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
  chestStructure: THREE.Object3D
  resource: any
  originPos: THREE.Vector3 = new THREE.Vector3()
  animation: {[key: string]: any} = {}
  openYaxisOffset: number = 1.3
  openIndex: number = 0

  // PostProcessing
  outlineChest: any
  
  // blockchain
  contract?: Contract
  loots: ChestItem[] = []

  constructor() 
  {
    this.experience     = Experience.Instance()
    this.root           = this.experience.root
    this.raycaster      = this.experience.raycaster
    this.scene          = this.experience.scene
    this.resources      = this.experience.resources
    this.preLoader      = this.experience.preLoader 
    this.materials      = this.experience.materials
    this.time           = this.experience.root.clock
    this.sounds         = this.experience.sounds

    this.chestModel     = this.resources.items.chestModel
    this.chestScene     = this.chestModel.scene
    this.chestStructure = this.chestScene.getObjectByName("Object_7")!
    this.resource       = this.resources.items.scene

    this.outlineChest   = this.experience.root["outlineChestHover"]


    this.setGLTF()
    this.setAnimation()
    this.setEvent()
  }

  setGLTF() 
  {
    this.chestModel.scene.position.copy(new THREE.Vector3(1.64, 0, 8.76))
    this.chestModel.scene.rotation.y = -(Math.PI * 0.25)
    this.originPos.copy(this.chestModel.scene.position)

    this.chestStructure.layers.enable(1)
    this.chestStructure.layers.disableAll()
    
    this.chestStructure.name = "chest"

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
    this.preLoader.on("start", () => {
  
      this.contract = this.experience.world.lootBoxScene?.smartContracts.chestSC
  
      this.experience.world.lootBoxScene?.smartContracts.chestSC.on("import chest", async () => {
        const IContract = this.contract!.interface!.connect(this.experience.world.user?.wallet.signer)
        const loots = await IContract.callStatic.look()
        this.setLoots(loots)
      })
  
    })

    
    this.raycaster.on("clickChest", () => 
    {
      let action = this.animation.action.current
      let open   = this.sounds.openChest
      let close  = this.sounds.closeChest
      let loots  = this.loots

      // Close chest
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
      // Open chest
      else 
      {
        action.play()
        open.play()
        setTimeout(() => action.paused = true, 500)
      }
    })

    this.raycaster.on("selectChestItem", (args: string) => {

    })




    this.raycaster.on("mouse_enter_chest", (obj3dName: string) => {

      const parsedName = obj3dName.split('_').pop() // parsing name of object being hovered

      switch(parsedName) {
        case "chest":
          this.chestStructure.layers.enable(1) // This will enable the outline effect of oering object
        break

        case "chestItem":
          let index = parseInt(obj3dName.split('_')[1]) // parsing the index of item in chest
          this.loots[index].mesh!.layers.enable(2) // This will enable the outline effect of oering object
        break
      }

    })

    this.raycaster.on("mouse_leave_chest", (obj3dName: string) => {

      const parsedName = obj3dName.split('_').pop() // parsing name of object being hovered

      switch(parsedName) {
        case "chest":
          this.chestStructure.layers.disable(1) // This will enable the outline effect of oering object
        break

        case "chestItem":
          let index = parseInt(obj3dName.split('_')[1]) // parsing the index of item in chest
          this.loots[index].mesh!.layers.disable(2) // This will enable the outline effect of oering object
        break
      }
    })
  }

  setLoots(loots: {items: string[], tokenIds: BigNumberish[], amounts: BigNumberish[], type_: number[]}) 
  {
    const chestItems: ChestItem[] = []
    for (let i = 0; i < loots.items.length; i++) 
    {
      chestItems.push(

        new ChestItem(this, {
          index: i,
          address: loots.items[i],
          id: loots.tokenIds[i],
          amount: loots.amounts[i],
          type: loots.type_[i],
        })

      )
    }

    chestItems.forEach((item: ChestItem) => this.outlineChest.add(item.mesh))
    this.loots = chestItems
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

        let chestDirection = this.chestScene.getWorldDirection(new Vector3()) // Getting the dirrection of our chest (looking at)
        chestDirection.x = -chestDirection.x                                  // rotate this direction by 90deg

        // Calculing final position of current item
        let finalPosition = new THREE.Vector3().copy(this.originPos)
        finalPosition.add( new THREE.Vector3().addScalar(this.openIndex - ( this.loots.length / 2 ) + 0.5).multiply(chestDirection) )
        
        // the difference amount of distance between initial position and final position
        let diffenrence = new THREE.Vector3().copy(finalPosition).sub(this.originPos)

        
        // 1. Animation during the openning of chest
        if ( this.openYaxisOffset - this.loots[this.openIndex].mesh!.position.y > 0 ) 
        {
          this.loots[this.openIndex].mesh!.position.x = this.originPos.x + ( diffenrence.x * ((this.loots[this.openIndex].mesh!.position.y / this.openYaxisOffset)));
          this.loots[this.openIndex].mesh!.position.z = this.originPos.z + ( diffenrence.z * ((this.loots[this.openIndex].mesh!.position.y / this.openYaxisOffset)));

          this.loots[this.openIndex].mesh!.position.y += (this.time.getDelta() * 400);
          
          // While getting to its final position rotate the item
          this.loots[this.openIndex].mesh!.rotation.y = this.time.getElapsedTime() * 10
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