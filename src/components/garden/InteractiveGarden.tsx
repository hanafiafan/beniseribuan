'use client'
import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  PresentationControls,
  Float,
  Sparkles,
  MeshWobbleMaterial,
  MeshDistortMaterial
} from '@react-three/drei'
import * as THREE from 'three'

function Plant({ position, color, speed = 1, factor = 0.6 }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 1, 16]} />
        <MeshWobbleMaterial color={color} speed={speed} factor={factor} />
      </mesh>
      {/* Leaves */}
      <mesh position={[position[0], position[1] + 0.5, position[2]]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <MeshDistortMaterial color={color} speed={speed} distort={0.4} radius={1} />
      </mesh>
    </Float>
  )
}

function Garden() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
      
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group position={[0, -1, 0]}>
          {/* Ground / Glass Pot */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[3, 32]} />
            <meshStandardMaterial color="#f0fdf4" transparent opacity={0.6} />
          </mesh>
          
          {/* Plants */}
          <Plant position={[-1, 0.5, 0]} color="#4ade80" speed={1.2} />
          <Plant position={[1, 0.5, 0.5]} color="#22c55e" speed={1} />
          <Plant position={[0, 0.5, -1]} color="#16a34a" speed={1.5} />
          
          <Sparkles count={40} scale={5} size={2} speed={0.4} opacity={0.3} color="#fcd34d" />
        </group>
      </PresentationControls>

      <Suspense fallback={null}>
        <Environment preset="forest" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
      </Suspense>
    </>
  )
}

export default function InteractiveGarden() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <Garden />
      </Canvas>
      
      {/* Hint Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Geser untuk Memutar Taman</span>
        </div>
      </div>
    </div>
  )
}
