import * as THREE from "three";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Experience from "../Experience";
import Resources from "./Resources";

export default class Factory {
  experience: Experience
  resources: Resources
  erc20?: any
  erc721?: any
  erc1155?: any

  constructor() 
  {
    this.experience = Experience.Instance()
    this.resources = this.experience.resources
  
    this.resources.on("ready", () => {
      this.erc20 = this.resources.items.erc20Model
      this.erc721 = this.resources.items.erc721Model
      this.erc1155 = this.resources.items.erc1155Model
    })

  }

  public createTextMesh(text: string, color: string = "white", obj?: any): THREE.Mesh<THREE.BufferGeometry, THREE.Material>
  {
    const textGeometry = new TextGeometry(
      text.split('').join(' '), 
      {
        font: this.resources.items.aovel, 
        size: obj?.size || 0.5,
        height: obj?.height || 0.2,
        curveSegments: obj?.curveSegments || 12,
        bevelEnabled: obj?.bevelEnabled || true,
        bevelThickness: obj?.bevelThickness || 0.03,
        bevelSize: obj?.bevelSize || 0.02,
        bevelOffset: obj?.bevelOffset || 0,
        bevelSegments: obj?.bevelSegments || 5
      }
    )
    textGeometry.center()
    const textMaterial = new THREE.MeshMatcapMaterial({ color: color })
    // textMaterial.wireframe = true
    const mesh = new THREE.Mesh(textGeometry, textMaterial)
    mesh.castShadow = true
    mesh.name = text
    return mesh
  }

  public createSmartContractMesh(abi: string[] & Object[], meshes: THREE.Mesh[], bytecode?: string, address?: string)
  {}

  public createErc20Mesh(address: string): THREE.Group
  {
    const token = this.erc20.scene.clone()
    
    token.name = address

    return token
  }

  public createErc721Mesh(address: string, name: string, id: string): THREE.Group
  {
    const token =  this.erc721.scene.clone()
    const nameMesh = this.createTextMesh(name)
    const idMesh = this.createTextMesh(id.toString())
    
    token.name = address
    token.getObjectByName("erc721_name")!.copy(nameMesh)
    token.getObjectByName("erc721_id")!.copy(idMesh)

    return token
  }

  public createErc1155Mesh(address: string, name: string = "beautiful nft", id: string): THREE.Group
  {
    const token = this.erc1155.scene.clone()
    const nameMesh = this.createTextMesh(name)
    const idMesh = this.createTextMesh(id.toString())
    
    token.name = address
    token.getObjectByName("erc721_name")!.copy(nameMesh)
    token.getObjectByName("erc721_id")!.copy(idMesh)

    return token
  }
}