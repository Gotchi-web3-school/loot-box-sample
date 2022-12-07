import * as THREE         from "three";
import { Scene, Vector3 } from "three";
import GUI                from "lil-gui";
import Experience         from "../Experience";
import Debug              from "../Utils/Debug";
import Resources          from "../Utils/Resources";
import Time               from "../Utils/Time";
import Wallet             from "../Utils/Wallet";
import Camera             from "../Camera";
import Controller         from "../Controller";
import Socket             from "../Utils/Socket";

const UP    = ["ArrowUp", 'w', 'W']
const DOWN  = ["ArrowDown", 's', 'S']
const LEFT  = ["ArrowLeft", 'a', 'A']
const RIGHT = ["ArrowRight", 'd', 'D']

export default class User {
  // Class
  experience: Experience
  socket: Socket
  scene: Scene
  resources: Resources
  camera: Camera
  controller: Controller
  time: Time
  debug: Debug
  wallet: Wallet

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

  // Debug
  debugFolder: GUI | undefined
  positionDebugFolder: GUI | undefined
  rotationDebugFolder: GUI | undefined

  constructor() 
  {
    this.experience = Experience.Instance()
    this.socket = Socket.Instance()
    this.wallet = new Wallet(this)
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.controller = this.experience.controller
    this.fox.model = this.resources.items.foxModel
    this.debug = this.experience.debug
    this.camera.user = this

    this.setGLTF()
    this.setAnimations()
    this.setActions()
  }

  private setGLTF(): void 
  {
    this.fox.scene = this.resources.items.foxModel.scene
    this.fox.scene.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.fox.scene)

    this.fox.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true }
    })
    this.camera.controls.target = this.fox.scene.position 
  }

  private setAnimations(): void 
  {
    this.fox.animation = {}
    this.fox.animation.mixer = new THREE.AnimationMixer(this.fox.scene)
    
    this.fox.animation.action = {}
    this.fox.animation.action.idle = this.fox.animation.mixer.clipAction(this.fox.model.animations[0])
    this.fox.animation.action.walk = this.fox.animation.mixer.clipAction(this.fox.model.animations[1])
    this.fox.animation.action.run = this.fox.animation.mixer.clipAction(this.fox.model.animations[2])

    this.fox.animation.action.current = this.fox.animation.action.idle
    this.fox.animation.action.current.play()
  }

  private setActions(): void 
  {
    // Player is moving
    window.addEventListener("keydown", (event) => 
    {
        // Run
        if (UP.includes(event.key)) 
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
        if (DOWN.includes(event.key)) 
        {
          this.isMoving = true
          this.movements["ArrowDown"] = true
          this.movements["ArrowUp"] = false
          this.movementType = "walk"
          this.fox.animation.action.current = this.fox.animation.action.walk
          this.fox.animation.action.current.play()
        }

        // Rotate left
        if (LEFT.includes(event.key)) 
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
        if (RIGHT.includes(event.key))
        {
          this.movements["ArrowRight"] = true
          if (!this.isMoving) 
          { 
            this.movementType = "walk"
            this.fox.animation.action.current = this.fox.animation.action.walk
            this.fox.animation.action.current.play()  
          }
        }
    }) 

    // Player stop moving
    window.addEventListener("keyup", (event) => 
    {
      if (UP.includes(event.key) || DOWN.includes(event.key))
      {
        UP.includes(event.key) ? this.movements["ArrowUp"] = false : this.movements["ArrowDown"] = false
        this.isMoving = false
        this.movementType = "idle"
        this.fox.animation.action.current = this.fox.animation.action.idle
        this.fox.animation.action.run.stop()
        this.fox.animation.action.walk.stop()
      }

      if (LEFT.includes(event.key) || RIGHT.includes(event.key))
      {
        LEFT.includes(event.key) ? this.movements["ArrowLeft"] = false : this.movements["ArrowRight"] = false
        if (!this.isMoving) 
        { 
          this.movementType = "idle"
          this.fox.animation.action.current = this.fox.animation.action.idle
          this.fox.animation.action.walk.stop()
        }
      }
    })
  }

  // Update the position of user for each frame depending of the key pressed => {up, down, left, right}
  private move(): void
  {
    const vector = new Vector3()
    const direction: THREE.Vector3 = this.fox.scene.getWorldDirection(vector)

    if (this.movements.ArrowUp)
    {
      this.fox.scene.position.z += (this.time.deltaTime * direction.z) * 9
      this.fox.scene.position.x += (this.time.deltaTime * direction.x) * 9
      this.socket.socket.emit("move", this.fox.scene.position)
    }

    if (this.movements.ArrowDown)
    {
      this.fox.scene.position.z -= (this.time.deltaTime * direction.z) * 3
      this.fox.scene.position.x -= (this.time.deltaTime * direction.x) * 3
      this.socket.socket.emit("move", this.fox.scene.position)

    }

    if (this.movements.ArrowLeft)
    {
      this.fox.scene.rotation.y += this.time.deltaTime * 3
      this.socket.socket.emit("move", this.fox.scene.position)

    }

    if (this.movements.ArrowRight)
    {
      this.fox.scene.rotation.y -= this.time.deltaTime * 3
      this.socket.socket.emit("move", this.fox.scene.position)

    }

  }

  public update(): void 
  {
    this.move()
    this.fox.animation.mixer.update(this.time.deltaTime * this.movementMultiplier[this.movementType])
  }
}