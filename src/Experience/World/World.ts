import * as THREE from "three"
import Experience from "../Experience";
import Environment from "./Environment";
import User from "./User";
import Resources from "../Utils/Resources";
import LootBoxScene from "./LootBoxScene";

export default class World {
  // Classes
  experience: Experience
  scene: THREE.Scene
  resources: Resources
  lootBoxScene?: LootBoxScene
  user?: User
  environment?: Environment


  constructor() {

    this.experience = Experience.Instance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    const gridHelper = new THREE.GridHelper(100, 100);
    this.scene.add(gridHelper);

    this.resources.on("ready", () => {
      this.lootBoxScene = new LootBoxScene()
      this.user = new User();
      this.environment = new Environment();
    })

  }

  update(): void 
  {
    this.user?.update()
    this.lootBoxScene?.update()
  }

}