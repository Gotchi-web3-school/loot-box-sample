import * as THREE         from "three";
import { Scene }          from "three";
import { clone }          from 'three/examples/jsm/utils/SkeletonUtils.js';
import Experience         from "../Experience";
import Resources          from "../Utils/Resources";
import Room               from "../Utils/Room";
import Time               from "../Utils/Time";

const UP    = ["ArrowUp", 'w', 'W']
const DOWN  = ["ArrowDown", 's', 'S']
const LEFT  = ["ArrowLeft", 'a', 'A']
const RIGHT = ["ArrowRight", 'd', 'D']

export default class Player {
  socketID: string

  // Class
  experience: Experience
  room: Room
  scene: Scene
  time: Time
  resources: Resources

  // Model
  fox: { [key: string]: any } = {}
  isMoving: boolean = false
  movements: { [key: string]: boolean } = {
    "ArrowUp": false, 
    "ArrowDown": false, 
    "ArrowLeft": false, 
    "ArrowRight": false,
  }
  movementType: string = "idle"
  movementMultiplier: { [key: string]: number } = {"idle": 1, "walk": 1, "run": 3}

  constructor(socketID: string) 
  {
    this.socketID   = socketID
    this.experience = Experience.Instance()
    this.room       = Room.Instance()
    this.scene      = this.experience.scene
    this.time       = this.experience.time
    this.resources  = this.experience.resources
    this.fox.model  = this.resources.items.foxModel

    this.setGLTF()
    this.setAnimations()
  }

  private setGLTF(): void 
  {
    this.fox.scene = clone(this.resources.items.foxModel.scene)
    this.fox.scene.position.set( 0, 0, 0 );
    this.scene.add(this.fox.scene)
  }

  private setAnimations(): void 
  {
    this.fox.animation        = {}
    this.fox.animation.mixer  = new THREE.AnimationMixer(this.fox.scene)
    
    this.fox.animation.action       = {}
    this.fox.animation.action.idle  = this.fox.animation.mixer.clipAction(this.fox.model.animations[0])
    this.fox.animation.action.walk  = this.fox.animation.mixer.clipAction(this.fox.model.animations[1])
    this.fox.animation.action.run   = this.fox.animation.mixer.clipAction(this.fox.model.animations[2])

    this.fox.animation.action.current = this.fox.animation.action.idle
    this.fox.animation.action.current.play()
  }


  onKeyup(key: string): void 
  {
    console.log("key: ", key)
    if (UP.includes(key) || DOWN.includes(key))
    {
      UP.includes(key) ? this.movements["ArrowUp"] = false : this.movements["ArrowDown"] = false
      this.isMoving = false
      this.movementType = "idle"
      this.fox.animation.action.current = this.fox.animation.action.idle
      this.fox.animation.action.run.stop()
      this.fox.animation.action.walk.stop()
    }

    if (LEFT.includes(key) || RIGHT.includes(key))
    {
      LEFT.includes(key) ? this.movements["ArrowLeft"] = false : this.movements["ArrowRight"] = false
      if (!this.isMoving) 
      { 
        this.movementType = "idle"
        this.fox.animation.action.current = this.fox.animation.action.idle
        this.fox.animation.action.walk.stop()
      }
    }
  }

  onKeydown(key: string): void 
  {
    console.log("key: ", key)
    // Run
    if (UP.includes(key)) 
    {
      this.isMoving = true
      this.movements["ArrowUp"] = true
      this.movements["ArrowDown"] = false
      this.movementType = "run"
      this.fox.animation.action.current = this.fox.animation.action.run
      this.fox.animation.action.current.play()
      this.fox.animation.action.walk.stop()
    }

    // Walk
    if (DOWN.includes(key)) 
    {
      this.isMoving = true
      this.movements["ArrowDown"] = true
      this.movements["ArrowUp"] = false
      this.movementType = "walk"
      this.fox.animation.action.current = this.fox.animation.action.walk
      this.fox.animation.action.current.play()
    }

    // Rotate left
    if (LEFT.includes(key)) 
    {
      this.movements["ArrowLeft"] = true
      if (!this.isMoving) 
      { 
        this.movementType = "walk"
        this.fox.animation.action.current = this.fox.animation.action.walk
        this.fox.animation.action.current.play() 
      }
    }

    // Rotate right
    if (RIGHT.includes(key))
    {
      this.movements["ArrowRight"] = true
      if (!this.isMoving) 
      { 
        this.movementType = "walk"
        this.fox.animation.action.current = this.fox.animation.action.walk
        this.fox.animation.action.current.play()  
      }
    }
  }

  onMove(args): void 
  {
    this.fox.scene.position.copy(args.position)
    this.fox.scene.rotation.copy(args.rotation)
    console.log("position: ", this.fox.scene.position)
    console.log("rotation: ", this.fox.scene.rotation)
  }

  public update(): void 
  {
    this.fox.animation.mixer.update(this.time.deltaTime * this.movementMultiplier[this.movementType])
  }
}