import * as THREE         from "three";
import { Vector3 }        from "three";
import gsap               from "gsap";
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
import Factory            from "../Utils/Factory";


export default class Chest {
  // Class
  experience: Experience
  root: RootState
  raycaster: Raycaster
  factory: Factory
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
  lootAllButton?: THREE.Mesh
  lootSelectedButton?: THREE.Mesh
  resource: any
  originPos: THREE.Vector3 = new THREE.Vector3()
  animation: {[key: string]: any} = {}
  openYaxisOffset: number = 1.3
  selected: ChestItem[] = []
  locked: boolean = false
  openned: boolean = false

  // blockchain
  contract?: Contract
  loots: ChestItem[] = []

  // PostProcessing
  outlineChest: any

  constructor() 
  {
    this.experience     = Experience.Instance()
    this.root           = this.experience.root
    this.raycaster      = this.experience.raycaster
    this.factory        = this.experience.factory
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

    this.outlineChest  = this.experience.root["outlineChestHover"]

    this.setGLTF()
    this.setLootButton()
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

  setLootButton()
  {
    this.lootAllButton = this.resources.items.buttonLootAll.scene.children[0]
    this.lootSelectedButton = this.resources.items.buttonLootSelected.scene.children[0]

    this.lootAllButton!.position.copy(this.chestScene.position)
    this.chestScene.getWorldQuaternion(this.lootAllButton!.quaternion)
    this.lootSelectedButton!.position.copy(this.chestScene.position)
    this.chestScene.getWorldQuaternion(this.lootSelectedButton!.quaternion)

    this.scene.add(this.lootAllButton!, this.lootSelectedButton!)
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

    
    this.raycaster.on("click_chest", () => 
    {
      let action = this.animation.action.current
      let open   = this.sounds.openChest
      let close  = this.sounds.closeChest

      // Close chest
      if (action.paused) 
      {
        action.paused = false
        close.play()
        
        setTimeout(() => action.stop(), 500)
        
        this.closeAnimation()
      }
      // Open chest
      else 
      {
        action.play()
        open.play()
        setTimeout(() => action.paused = true, 500)
      }
    })



    this.raycaster.on("mouse_enter_chest", (obj3dName: string) => {

      this.chestStructure.layers.enable(1) // This will enable the outline effect of oering object

    })

    this.raycaster.on("mouse_leave_chest", (obj3dName: string) => {

      this.chestStructure.layers.disable(1) // This will enable the outline effect of oering object

    })
  }

  async setLoots(loots: {items: string[], tokenIds: BigNumberish[], amounts: BigNumberish[], type_: number[]}) 
  {
    const chestItems: any[] = []
    
    for (let i = 0; i < loots.items.length; i++) 
    {
      chestItems.push(

        new ChestItem(this, {
          index: i.toString(),
          address: loots.items[i],
          id: loots.tokenIds[i],
          amount: loots.amounts[i],
          type: loots.type_[i],
        })

      )
    }
    this.loots = chestItems

    // Set selction for layer 2 & disable all object3d's layer
    this.outlineChest.selection.set(this.raycaster.objectsToTest)
    this.raycaster.objectsToTest.forEach(object3D => object3D.layers.disable(2))
  }

  refreshLoots()
  {

  }










  /***********************************|
  |            Animations             |
  |__________________________________*/





  async openAnimation() 
  {
    if (this.animation.action.current.paused) 
    {
      if (this.locked === false && this.openned === false) 
      {
        this.locked = true


        let chestDirection = this.chestScene.getWorldDirection(new Vector3()) // Getting the dirrection of our chest (looking at)
        chestDirection.x = -chestDirection.x                                  // rotate this direction by 90deg

        // 1. Items animation
        /************************************************************************************************************************ */

        for(let i = 0; i < this.loots.length; i++ ) 
        {
          // Calculing final position of current item
          let finalPos = new THREE.Vector3().copy(this.originPos)                                                     // chest pos
          finalPos.add( new THREE.Vector3().addScalar(i - ( this.loots.length / 2 ) + 0.5).multiply(chestDirection) ) // X axis
          finalPos.add(new THREE.Vector3(0, Math.cos(Math.sin(-this.time.getElapsedTime())) + this.openYaxisOffset, 0))                                                 // Y axis

          let itemPos = this.loots[i].mesh!.position
          let itemRotation = this.loots[i].mesh!.rotation

          
          gsap.to(itemPos,       { duration: 0.5, ease: "power1.out", x: finalPos.x, y: finalPos.y, z: finalPos.z })
          gsap.to(itemRotation,  { duration: 0.5, ease: "power1.out", x: itemRotation.x, y: itemRotation.y, z: itemRotation.z * Math.PI })

          await this.sleep(200)
          
          setTimeout(() => this.loots[i].out = true, 300)
        }

        /************************************************************************************************************************ */


        await this.sleep(600)


        // 2. Button animation
        /************************************************************************************************************************ */
        
        let pos = new THREE.Vector3().copy(this.originPos)
        gsap.to(this.lootAllButton!.position,       { duration: 1, ease: "power1.out", x: pos.x, y: pos.y + 1, z: pos.z })
        gsap.to(this.lootSelectedButton!.position,  { duration: 1, ease: "power1.out", x: pos.x, y: pos.y + 1, z: pos.z })
        
        await this.sleep(1100)

        pos.copy(this.lootAllButton!.position)
        gsap.to(this.lootAllButton!.position,       { duration: 0.4, ease: "power1.out", x: pos.x + chestDirection.x, y: pos.y, z: pos.z + chestDirection.z })
        gsap.to(this.lootSelectedButton!.position,  { duration: 0.4, ease: "power1.out", x: pos.x - chestDirection.x, y: pos.y, z: pos.z - chestDirection.z })
        
        /************************************************************************************************************************ */
        

        this.openned = true
        this.locked = false
      }

      // 3. Animaton once all the item has been set up hovering above the chest
      this.loots.forEach((loot: ChestItem) => loot.update())
    }
  }

  closeAnimation()
  {
    for(const loot of this.loots) {
      loot.mesh!.position.copy(this.chestScene.position)
      loot.out = false
    }
    this.lootAllButton?.position.copy(this.originPos)
    this.lootSelectedButton?.position.copy(this.originPos)
    this.openned = false
  }









  /***********************************|
  |         Public functions          |
  |__________________________________*/






  /**
   * @name sleep
   * @notice Just stop the function where it is called until "ms" second is passed
   * @param ms The waiting time in milliseconds
   * @returns a Promise
   */
  sleep(ms: number): Promise<unknown> 
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  update() 
  {
    this.animation.mixer.update(0.02)
    this.openAnimation()
  }
}