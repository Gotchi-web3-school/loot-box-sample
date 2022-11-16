import * as THREE from "three"
import Experience from "../Experience"
import PreLoader from "../PreLoader"
import Debug from "./Debug"
import Resources from "./Resources"

export default class Materials {
  experience: Experience
  debug: Debug
  scene: THREE.Scene
  resources: Resources
  preLoader: PreLoader
  items: {[key: string]: any} = {}
  ethMaterial: any
  chestMaterial: any
  contractInterfaceMaterial: any
  deployContract: any

  constructor() {
    this.experience = Experience.Instance()
    this.debug = this.experience.debug
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.preLoader = this.experience.preLoader

    // Wait for textures
    this.resources.on('ready', () =>
    {
      this.mapTextures()
    })
  }

  mapTextures()
  {
    Object.entries(this.resources.items).forEach((key: any) => {
      if (key[0].slice(-4) === "Icon") {
        this.resources.items[`${key[0]}`].encoding = THREE.sRGBEncoding
        this.resources.items[`${key[0]}`].minFilter = THREE.NearestFilter
      }
    })

    // this.items.contractInterfaceMaterial = new THREE.MeshStandardMaterial({ transparent: true, depthWrite: false, map: this.resources.items.bakedInputScreenTexture, side: THREE.DoubleSide })
    this.items.contractInterfaceMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.8, color: "#000000", depthWrite: false, side: THREE.DoubleSide })

    // functions materials
    this.items.addWhitelist         = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.addWhitelistIcon, side: THREE.DoubleSide })
    this.items.approveErc20         = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.approveErc20Icon, side: THREE.DoubleSide })
    this.items.approveErc721        = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.approveErc721Icon, side: THREE.DoubleSide })
    this.items.approveAllErc721     = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.approveAllErc721Icon, side: THREE.DoubleSide })
    this.items.approveAllErc1155    = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.approveAllErc1155Icon, side: THREE.DoubleSide })
    
    this.items.batchBurnErc1155     = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.batchBurnErc1155Icon, side: THREE.DoubleSide })
    this.items.batchLoot            = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.batchLootIcon, side: THREE.DoubleSide })
    this.items.batchMintErc1155     = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.batchMintErc1155Icon, side: THREE.DoubleSide })
    this.items.batchTransferErc1155 = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.batchTransferErc1155Icon, side: THREE.DoubleSide })
    this.items.burnErc20            = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.burnErc20Icon, side: THREE.DoubleSide })
    this.items.burnErc721           = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.burnErc721Icon, side: THREE.DoubleSide })
    this.items.burnErc1155          = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.burnErc1155Icon, side: THREE.DoubleSide })
    
    this.items.deployContract       = new THREE.MeshBasicMaterial({ alphaTest: 0.01, map: this.resources.items.deployContractIcon, side: THREE.DoubleSide })
    this.items.deposit              = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.depositIcon, side: THREE.DoubleSide })

    this.items.ethConnected         = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.9, color: "#6b40c8", metalness: 0.7, roughness: 0.5, toneMapped: false})
    
    this.items.import               = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.importIcon, side: THREE.DoubleSide })
    
    this.items.loot                 = new THREE.MeshBasicMaterial({ alphaTest: 0.1, map: this.resources.items.lootIcon, side: THREE.DoubleSide })

    this.items.mintErc20            = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.mintErc20Icon, side: THREE.DoubleSide })
    this.items.mintErc721           = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.mintErc721Icon, side: THREE.DoubleSide })
    this.items.mintErc1155          = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.mintErc1155Icon, side: THREE.DoubleSide })
    
    this.items.transferErc20        = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.transferErc20Icon, side: THREE.DoubleSide })
    this.items.transferErc721       = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.transferErc721Icon, side: THREE.DoubleSide })
    this.items.transferErc1155      = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.transferErc1155Icon, side: THREE.DoubleSide })
    this.items.transferOwnership    = new THREE.MeshBasicMaterial({ alphaTest: 0.001, map: this.resources.items.transferOwnershipIcon, side: THREE.DoubleSide })
    this.items.txPending            = new THREE.MeshStandardMaterial({ color: "orange", transparent: true, opacity: 0.9, metalness: 0.7, roughness: 0.5, toneMapped: false})
    this.items.txValided            = new THREE.MeshStandardMaterial({ color: "green", transparent: true, opacity: 0.9, metalness: 0.7, roughness: 0.5, toneMapped: false})
    this.items.txFailed             = new THREE.MeshStandardMaterial({ color: "red", transparent: true, opacity: 0.9, metalness: 0.7, roughness: 0.5, toneMapped: false})

    this.resources.trigger("texturesMapped")
  }
}