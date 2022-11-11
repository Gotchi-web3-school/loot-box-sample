import { useEffect, useRef, useState } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei"
import { useControls } from 'leva'
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
  const inputsFunctionRef = useRef<any>()
  const chestRef = useRef<any>()
  const erc20Ref = useRef<any>()
  const erc721Ref = useRef<any>()

  useEffect(() => {
    root.controls = controlsRef.current
    root["chest"] = chestRef.current
    root["erc20"] = erc20Ref.current
    root["erc721"] = erc721Ref.current

    setExperience(Experience.Instance(root, controlsRef.current))

  }, [root])

  useFrame( () => experience?.update() )

  const { sunPosition } = useControls('sky', {
    sunPosition: { value: [ 1, 2, 3 ] }
})
  
  return (
    <>
      <color args={ ["#695b5b"] } attach="background" />

      <OrbitControls args={ [root.camera, root.gl.domElement] } ref={controlsRef} />
      <Sky sunPosition={sunPosition}/>

      <group ref={inputsFunctionRef} >
        
        <group ref={chestRef}>
          { experience &&
            <>
              <ChestDeployer     group={"chest"} experience={experience} />
              <Import            group={"chest"} experience={experience} />
              <AddWhitelist      group={"chest"} experience={experience} />
              <BatchDeposit      group={"chest"} experience={experience} />
              <Loot              group={"chest"} experience={experience} />
              <BatchLoot         group={"chest"} experience={experience} />
              <TransferOwnership group={"chest"} experience={experience} props={{ rotation: [0, 0.64, 0] }} />
            </>
          }
        </group>
        
        <group ref={erc20Ref}>
          { experience &&
            <>
              <ERC20Deployer     group={"erc20"} experience={experience} />
              <Import            group={"erc20"} experience={experience} />
              <ApproveERC20      group={"erc20"} experience={experience} />
              <MintERC20         group={"erc20"} experience={experience} />
              <BurnERC20         group={"erc20"} experience={experience} />
              <TransferErc20     group={"erc20"} experience={experience} />
              <TransferOwnership group={"erc20"} experience={experience} props={{ rotation: [ 0, Math.PI, 0 ] }} />
            </>
          }
        </group>

        <group ref={erc721Ref}>
          { experience &&
            <>
              <ERC721Deployer          group={"erc721"} experience={experience} />
              <Import                  group={"erc721"} experience={experience} />
              <ApproveERC721           group={"erc721"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <SetApprovalForAll       group={"erc721"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <SafeMintERC721          group={"erc721"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <SafeTransferFromErc721  group={"erc721"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <BurnERC721              group={"erc721"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
              <TransferOwnership       group={"erc721"} experience={experience} props={{ rotation: [ 0, Math.PI * 1.5, 0 ] }} />
            </>
          }
        </group>

      </group>
    </>
  );
}

export default App