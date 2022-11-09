import * as THREE from "three";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Experience from "../Experience";
import Resources from "./Resources";

export default class Factory {
  experience: Experience
  resources: Resources

  constructor() 
  {
    this.experience = Experience.Instance()
    this.resources = this.experience.resources
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
}