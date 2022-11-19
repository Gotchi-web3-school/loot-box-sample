import { useEffect, useRef, useState } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei"
import { useControls } from 'leva'
import { Bloom, EffectComposer, Outline } from '@react-three/postprocessing'
import Experience from "./Experience/Experience";
import AddWhitelist from "./fiber/AddWhitelist";
import ApproveERC20 from "./fiber/ApproveERC20";
import ApproveERC721 from "./fiber/ApproveERC721";
import SetApprovalForAll from "./fiber/SetApprovalForAll";
import ChestDeployer from "./fiber/ChestDeployer";
import ERC20Deployer from "./fiber/ERC20Deployer";
import ERC721Deployer from "./fiber/ERC721Deployer";
import Import from "./fiber/Import";
import BatchDeposit from "./fiber/BatchDeposit";
import TransferOwnership from "./fiber/TransferOwnership";
import Loot from './fiber/Loot'
import BatchLoot from './fiber/BatchLoot'
import MintERC20 from "./fiber/MintERC20";
import SafeMintERC721 from "./fiber/SafeMintERC721";
import TransferErc20 from "./fiber/TransferERC20";
import SafeTransferFromErc721 from "./fiber/SafeTransferFromErc721";
import BurnERC20 from "./fiber/BurnERC20";
import BurnERC721 from "./fiber/BurnERC721";



extend({ OrbitControls })

function App() {
  const [experience, setExperience] = useState<Experience>()
  const root = useThree()
  const controlsRef = useRef<any>()
  const starsRef = useRef<any>()
  const inputsFunctionRef = useRef<any>()
  const outLineRef = useRef<any>()
  const composerRef = useRef<any>()
  const chestRef = useRef<any>()
  const erc20Ref = useRef<any>()
  const erc721Ref = useRef<any>()

  useEffect(() => {
    root.controls = controlsRef.current
    root["outlineHover"] = outLineRef.current
    root["chestSC"] = chestRef.current
    root["erc20SC"] = erc20Ref.current
    root["erc721SC"] = erc721Ref.current

    setExperience(Experience.Instance(root, controlsRef.current))

  }, [root])


  useFrame( () => { experience?.update() } )

  const { radius, depth, count, factor, saturation, speed } = useControls('sky', {

    radius:     { value: 64,    min: 0, max: 100    },
    depth:      { value: 130,   min: 0, max: 500    },
    count:      { value: 9000,  min: 0, max: 100000 },
    factor:     { value: 4,     min: 0, max: 20     },
    saturation: { value: 10,    min: 0, max: 1      },
    speed:      { value: 3,     min: 0, max: 10     },

  })

  const { intensity, luminanceThreshold, luminanceSmoothing } = useControls('bloom', {

    intensity:            { value: 2,     min: 0, max: 10, step: 0.1 },
    luminanceThreshold:   { value: 0.9,   min: 0, max: 1             },
    luminanceSmoothing:   { value: 0.025, min: 0, max: 1             },

  })



  return (
    <>
      <color args={ ["black"] } attach="background" />
      <OrbitControls args={ [root.camera, root.gl.domElement] } ref={controlsRef} />
      <Stars ref={starsRef} radius={radius} depth={depth} count={count} factor={factor} saturation={saturation} speed={speed} />
      

      <EffectComposer ref={composerRef} autoClear={false}>
        <Outline
            ref={outLineRef}
            selection={[]}
            selectionLayer={ 1 }
            xRay
            edgeStrength={2.5}
            visibleEdgeColor={0xffffff}
            hiddenEdgeColor={0x22090a}
         />
      
        <Bloom mipmapBlur intensity={ intensity } luminanceThreshold={ luminanceThreshold } luminanceSmoothing={ luminanceSmoothing } />
      </EffectComposer>


    
      <group ref={inputsFunctionRef} >
        
        <group ref={chestRef} >
          { experience &&
            <>
              <ChestDeployer     group={"chestSC"} experience={experience} />
              <Import            group={"chestSC"} experience={experience} />
              <AddWhitelist      group={"chestSC"} experience={experience} />
              <BatchDeposit      group={"chestSC"} experience={experience} />
              <Loot              group={"chestSC"} experience={experience} />
              <BatchLoot         group={"chestSC"} experience={experience} />
              <TransferOwnership group={"chestSC"} experience={experience} props={{ rotation: [0, 0.64, 0] }} />
            </>
          }
        </group>
        
        <group ref={erc20Ref}>
          { experience &&
            <>
              <ERC20Deployer     group={"erc20SC"} experience={experience} />
              <Import            group={"erc20SC"} experience={experience} />
              <ApproveERC20      group={"erc20SC"} experience={experience} />
              <MintERC20         group={"erc20SC"} experience={experience} />
              <BurnERC20         group={"erc20SC"} experience={experience} />
              <TransferErc20     group={"erc20SC"} experience={experience} />
              <TransferOwnership group={"erc20SC"} experience={experience} props={{ rotation: [ 0, Math.PI, 0 ] }} />
            </>
          }
        </group>

        <group ref={erc721Ref}>
          { experience &&
            <>
              <ERC721Deployer          group={"erc721SC"} experience={experience} />
              <Import                  group={"erc721SC"} experience={experience} />
              <ApproveERC721           group={"erc721SC"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <SetApprovalForAll       group={"erc721SC"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <SafeMintERC721          group={"erc721SC"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <SafeTransferFromErc721  group={"erc721SC"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <BurnERC721              group={"erc721SC"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <TransferOwnership       group={"erc721SC"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
            </>
          }
        </group>

      </group>
     
    </>
  );
}

export default App