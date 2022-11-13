import * as THREE from "three";
import Experience from "../Experience";
import Camera from "../Camera";
import PreLoader from "../PreLoader";
import World from "../World/World";
import User from "../World/User";
import Debug from "./Debug";
import HitboxDebug from "../Debug/HiteboxDebug";
import LootBoxScene from "../World/LootBoxScene";
import Resources from "./Resources";
import Controller from "../Controller";
import EventEmitter from "./EventEmitter";

export default class Raycaster extends EventEmitter{
  // Class
  experience: Experience
  scene: THREE.Scene
  debug: Debug
  mouse: THREE.Vector2
  camera: Camera
  controller: Controller
  resources: Resources
  preLoader: PreLoader
  world?: World
  user?: User
  lootBoxScene?: LootBoxScene
  
  // Debug
  hitboxDebug?: HitboxDebug
  
  // Ray caster
  raycaster = new THREE.Raycaster()
  intersectsObjects?: THREE.Intersection[]
  objectsToTest: THREE.Object3D[] = []
  currentIntersect?: THREE.Object3D | null = null
  currentIntersectParent?: THREE.Object3D<THREE.Event> | null = null
  cursorDown = new THREE.Vector2()
  cursor = new THREE.Vector2()

  // hovering
  currentHover: string | null = null

  // Hibox
  hitboxes: THREE.Box3[] = []

  chestSCHitBox = new THREE.Box3();
  erc20SCHitBox = new THREE.Box3();
  erc721SCHitBox = new THREE.Box3();
  erc1155SCHitBox = new THREE.Box3();

  constructor() {
    super()

    this.experience = Experience.Instance()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.mouse = this.experience.mouse
    this.camera = this.experience.camera
    this.controller = this.experience.controller
    this.preLoader = this.experience.preLoader
    this.resources = this.experience.resources

    this.preLoader.on("start", () => 
    {
      this.world = this.experience.world
      this.user = this.world.user
      this.lootBoxScene = this.world.lootBoxScene
      
      this.setHitbox()
      this.setObjectToTest()
      this.setWindowListener()
    })

  }
  
  private setHitbox()
  {
      this.hitboxes.push(new THREE.Box3().setFromObject(this.lootBoxScene?.models.chestSC))
      this.hitboxes.push(new THREE.Box3().setFromObject(this.lootBoxScene?.models.erc20SC))
      this.hitboxes.push(new THREE.Box3().setFromObject(this.lootBoxScene?.models.erc721SC))
      this.hitboxes.push(new THREE.Box3().setFromObject(this.lootBoxScene?.models.erc1155SC))
  
      if (this.debug.active) { this.hitboxDebug = new HitboxDebug() }    
  }

  private setObjectToTest()
  {
    // connect button
    this.objectsToTest.push(this.user!.wallet.mesh["connect"])

    // Hitboxes
    // this.hitboxes.forEach((box: THREE.Box3) => this.objectsToTest.push(box))
   
    // chest.sol
    this.objectsToTest.push(this.lootBoxScene?.models.chestSC)
    this.lootBoxScene?.models.chestSC.children.forEach((obj3d: THREE.Object3D) => this.objectsToTest.push(obj3d))

    // erc20.sol
    this.objectsToTest.push(this.lootBoxScene?.models.erc20SC)
    this.lootBoxScene?.models.erc20SC.children.forEach((obj3d: THREE.Object3D) => this.objectsToTest.push(obj3d))
    
    // erc721.sol
    this.objectsToTest.push(this.lootBoxScene?.models.erc721SC)
    this.lootBoxScene?.models.erc721SC.children.forEach((obj3d: THREE.Object3D) => this.objectsToTest.push(obj3d))

    // erc1155.sol
    this.objectsToTest.push(this.lootBoxScene?.models.erc1155SC)
    this.lootBoxScene?.models.erc1155SC.children.forEach((obj3d: THREE.Object3D) => this.objectsToTest.push(obj3d))

    // chest
    this.world!.chest!.chestScene.traverse((obj3d: THREE.Object3D) => 
    {
      if (obj3d instanceof THREE.SkinnedMesh)
      {
        obj3d.parent!.name = "chest"
        this.objectsToTest.push(obj3d)
      }
    })
  }

  private setWindowListener()
  {
    // Connect button
    window.addEventListener('click', async (event) => 
    {
      this.click()
      const intersects = this.raycaster?.intersectObject(this.user!.wallet.mesh["connect"])

      if (intersects?.length) 
      {
        if (this.user!.wallet.isConnected) { 
          this.user!.wallet.disconnect() 
        } else { 
          this.user!.wallet.connect() 
        }
      } 
      
    })

    // Click listener
    window.addEventListener('pointerup', (event) => this.click)
      
  }

  click(): void
  {
    this.raycaster.setFromCamera(this.mouse, this.camera.instance)

    //Object click listener
    this.intersectsObjects = this.raycaster.intersectObjects(this.objectsToTest)
    
    if (this.intersectsObjects.length) {
      this.currentIntersect = this.intersectsObjects[ 0 ].object
      this.currentIntersectParent = this.intersectsObjects[ 0 ].object.parent
    }

    // if (ethers.utils.isAddress(this.intersectsObjects[0]?.object.name ?? ""))
    // {
    //   navigator.clipboard.writeText(this.currentIntersect!.name);

    //   // Alert the copied text
    //   alert("Address copied: " + this.currentIntersect!.name);
    // }

    switch (this.controller.getCurrentMode()) 
    {
      
      /***********************************|
      |             0.WORLD               |
      |__________________________________*/
      case undefined:

        if (this.intersectsObjects.length && this.currentIntersectParent) 
        {
          switch(this.currentIntersectParent.name) 
          {

            case "chestSC":
              this.controller.worldControls.chestSC()
            break

            case "erc20SC":
              this.controller.worldControls.erc20SC()
            break

            case "erc721SC":
              this.controller.worldControls.erc721SC()
            break

            case "erc1155SC":
              this.controller.worldControls.erc1155SC()
            break

            case "chest":
              this.trigger("clickChest")
            break

            default:

          }
        }

      break
      /***********************************|
      |            1.CHESTSC              |
      |__________________________________*/
      case "chestContract":

        if ( this.intersectsObjects.length && (this.currentIntersect?.name.split('_').pop() === "deploy" ||
                                               this.currentIntersect?.name.split('_').pop() === "import") )
        {
          this.controller.chestContractControls.metaScreen()
          this.trigger("click_" + this.currentIntersect.name)
        }
        else if (this.intersectsObjects.length && this.currentIntersect?.name.split('_')[2] === "function" ) 
        {
          this.controller.chestContractControls.inputsScreen()
          this.trigger("click_" + this.currentIntersect.name)
        } 
        else
        {
          this.controller.worldControls.goBack()
        } 

      break
       /***********************************|
      |             1.ERC20SC              |
      |__________________________________*/
      case "erc20Contract":

        if ( this.intersectsObjects.length && (this.currentIntersect?.name.split('_').pop() === "deploy" ||
                                               this.currentIntersect?.name.split('_').pop() === "import") )
        {
          this.controller.erc20ContractControls.metaScreen()
          this.trigger("click_" + this.currentIntersect.name)
        }
        else if (this.intersectsObjects.length && this.currentIntersect?.name.split('_')[2] === "function" ) 
        {
          this.controller.erc20ContractControls.inputsScreen()
          this.trigger("click_" + this.currentIntersect.name)
        } 
        else
        {
          this.controller.worldControls.goBack()
        } 

      break
       /***********************************|
      |            1.ERC721SC              |
      |__________________________________*/
      case "erc721Contract":

        if ( this.intersectsObjects.length && (this.currentIntersect?.name.split('_').pop() === "deploy" ||
                                               this.currentIntersect?.name.split('_').pop() === "import") )
        {
          this.controller.erc721ContractControls.metaScreen()
          this.trigger("click_" + this.currentIntersect.name)
        }
        else if (this.intersectsObjects.length && this.currentIntersect?.name.split('_')[2] === "function" ) 
        {
          this.controller.erc721ContractControls.inputsScreen()
          this.trigger("click_" + this.currentIntersect.name)
        } 
        else
        {
          this.controller.worldControls.goBack()
        } 

      break
       /***********************************|
      |             1.ERC1155SC            |
      |__________________________________*/
      case "erc1155Contract":
        if (this.intersectsObjects.length) {

        } else {
          this.controller.worldControls.goBack()
        }

      break
       /***********************************|
      |           2.INPUTS PANEL           |
      |__________________________________*/
      case "inputsScreen":
        if (this.intersectsObjects.length) {

        } else {

        }

      break
    }
  }

  listenContract()
  {
    const contractGroup = this.controller.getCurrentMode()!.split("Contract").join("SC") 
    
    this.raycaster.setFromCamera(this.mouse, this.camera.instance)
    let meshes = this.lootBoxScene?.models[contractGroup].children

    //Object click listener
    this.intersectsObjects = this.raycaster.intersectObjects(meshes)

    if (this.controller.isLocked() === false) {
      
      if (this.intersectsObjects.length && this.intersectsObjects[0].object.name.split('_')[2] === "function" && this.currentHover === null) 
      {
        let funcName = this.intersectsObjects[0].object.name
        this.trigger("enter" + funcName)
        this.currentHover = funcName
      } 
      else 
      {
        if (this.currentHover && this.intersectsObjects[0]?.object.name !== this.currentHover)
        {
          this.trigger("leave" + this.currentHover)
          this.currentHover = null
        }
      }

    }
  }

  update()
  {
    if (this.controller.getCurrentMode()?.endsWith("Contract")) { this.listenContract() }
  }
}