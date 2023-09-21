import {
  OrbitControls
} from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense, useEffect, useState } from 'react';
import Model from './Model';
import PlaceHolder from './PlaceHolder';
import { Preload } from '@react-three/drei'

export default function Experience() {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowing(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    }
  }, [])

  return <>

    <Perf position="top-left" />

    <OrbitControls />

    <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
    <ambientLight intensity={0.5} />

    <mesh receiveShadow position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" />
    </mesh>


    {
      isShowing && (
        <Suspense fallback={<PlaceHolder position-y={0.5}
          scale={[2, 1, 2]} />}>
          <Model scale={0.35} position-y={-1} />
        </Suspense>
      )
    }

  </>
}