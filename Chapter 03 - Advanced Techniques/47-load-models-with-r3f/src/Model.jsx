import React from "react";
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  // const model = useLoader(GLTFLoader, '/hamburger-draco.glb', (loader) => {
  //   const dracoLoader = new DRACOLoader()
  //   dracoLoader.setDecoderPath('/draco/')
  //   loader.setDRACOLoader(dracoLoader)
  // })

  // const model = useGLTF('/hamburger.glb')
  const model = useGLTF('/FlightHelmet/glTF/FlightHelmet.gltf')

  return <primitive object={model.scene} {...props} />
}


useGLTF.preload('./FlightHelmet/glTF/FlightHelmet.gltf')
