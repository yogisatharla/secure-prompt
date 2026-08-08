// @ts-nocheck
/* eslint-disable react/no-unknown-property */
'use client';
import Component, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import React from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

// Use public paths for assets
const DEFAULT_LANYARD_IMAGE = "/assets/lanyard/lanyard.png";
const DEFAULT_CARD_GLB = "/assets/lanyard/card.glb";

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0.243, w: 0.5, h: 0.757 };
const BACK_UV_RECT = { x: 0.5, y: 0.243, w: 0.5, h: 0.757 };

class LanyardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Lanyard 3D component caught error:", error);
  }
  render() {
    if (this.state.hasError) {
      return <FallbackPassCard frontImage={this.props.frontImage} />;
    }
    return this.props.children;
  }
}

function FallbackPassCard({ frontImage }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({ x: -y / 12, y: x / 12 });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <div 
      className="lanyard-wrapper flex flex-col items-center justify-center relative overflow-hidden py-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-1.5 h-20 bg-gradient-to-b from-[#2B3550] via-[#D9A441] to-[#2B3550] rounded-full shadow-md animate-pulse mb-[-10px] z-0" />
      <div className="w-8 h-4 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 rounded-sm shadow-md border border-white/20 z-10 flex items-center justify-center mb-[-4px]">
        <div className="w-3 h-1 bg-gray-800 rounded-full" />
      </div>
      <div 
        className="w-52 h-80 rounded-2xl bg-[#1B2338] border border-[#2B3550] p-5 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden transition-transform duration-200 ease-out z-20 cursor-grab"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(217,164,65,0.05)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-8 h-6 bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 rounded-md border border-amber-300/40 opacity-80" />
          <span className="text-[9px] font-mono tracking-widest text-[#D9A441] font-bold">SECURE PASS</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center my-3 z-10">
          {frontImage ? (
            <img src={frontImage} alt="Security Pass" className="w-28 h-28 object-contain drop-shadow-md" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand-base border border-[#2B3550] flex items-center justify-center">
              <span className="text-2xl text-[#D9A441]">🛡️</span>
            </div>
          )}
        </div>
        <div className="w-full border-t border-[#2B3550] pt-3 z-10">
          <div className="text-xs font-mono font-bold text-[#ECEEF3] tracking-wider uppercase">SECURE PROMPT</div>
          <div className="text-[10px] font-sans text-[#8B93A9] tracking-tight">ENTERPRISE SECURITY</div>
        </div>
      </div>
    </div>
  );
}

export default function Lanyard(props) {
  return (
    <LanyardErrorBoundary frontImage={props.frontImage}>
      <LanyardInner {...props} />
    </LanyardErrorBoundary>
  );
}

function LanyardInner({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = DEFAULT_LANYARD_IMAGE,
  lanyardWidth = 1
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(DEFAULT_CARD_GLB);
  const texture = useTexture(lanyardImage || BLANK_PIXEL);
  const [cardMap, setCardMap] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const baseMap = materials?.base?.map;
    
    const W = baseMap?.image?.width || 1024;
    const H = baseMap?.image?.height || 1024;

    const generateTexture = (fImg = null, bImg = null) => {
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Fill canvas background
      ctx.fillStyle = '#121826';
      ctx.fillRect(0, 0, W, H);

      // Helper to draw card face
      const drawFace = (rect, isFront, img) => {
        const rx = rect.x * W;
        const ry = rect.y * H;
        const rw = rect.w * W;
        const rh = rect.h * H;

        // Card body background
        ctx.fillStyle = '#1B2338';
        ctx.fillRect(rx, ry, rw, rh);

        // Border
        ctx.strokeStyle = '#2B3550';
        ctx.lineWidth = 8;
        ctx.strokeRect(rx + 4, ry + 4, rw - 8, rh - 8);

        if (isFront) {
          // Gold Chip Emblem
          ctx.fillStyle = '#D9A441';
          ctx.fillRect(rx + 40, ry + 50, 60, 45);
          ctx.strokeStyle = '#B38128';
          ctx.lineWidth = 2;
          ctx.strokeRect(rx + 40, ry + 50, 60, 45);

          // Header Label
          ctx.fillStyle = '#D9A441';
          ctx.font = 'bold 18px monospace';
          ctx.textAlign = 'right';
          ctx.fillText('SECURE PASS', rx + rw - 40, ry + 78);

          // Center image or shield icon
          if (img && img.width && img.height) {
            const pick = imageFit === 'contain' ? Math.min : Math.max;
            const scale = pick((rw - 80) / img.width, (rh - 240) / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            const dx = rx + (rw - dw) / 2;
            const dy = ry + 120 + (rh - 280 - dh) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.rect(rx + 40, ry + 120, rw - 80, rh - 280);
            ctx.clip();
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.restore();
          } else {
            // Draw default shield icon in center
            ctx.fillStyle = '#121826';
            ctx.beginPath();
            ctx.arc(rx + rw / 2, ry + rh / 2 - 20, 70, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#D9A441';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = '#D9A441';
            ctx.font = '70px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🛡️', rx + rw / 2, ry + rh / 2 - 20);
          }

          // Footer
          ctx.strokeStyle = '#2B3550';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(rx + 30, ry + rh - 130);
          ctx.lineTo(rx + rw - 30, ry + rh - 130);
          ctx.stroke();

          ctx.fillStyle = '#ECEEF3';
          ctx.font = 'bold 32px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('SECURE PROMPT', rx + rw / 2, ry + rh - 80);

          ctx.fillStyle = '#8B93A9';
          ctx.font = '18px sans-serif';
          ctx.fillText('ENTERPRISE SECURITY', rx + rw / 2, ry + rh - 45);
        } else {
          // Back face
          // Mag stripe
          ctx.fillStyle = '#0A0D14';
          ctx.fillRect(rx, ry + 60, rw, 100);

          if (img && img.width && img.height) {
            const pick = imageFit === 'contain' ? Math.min : Math.max;
            const scale = pick((rw - 80) / img.width, (rh - 240) / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            const dx = rx + (rw - dw) / 2;
            const dy = ry + 180 + (rh - 280 - dh) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.rect(rx + 40, ry + 180, rw - 80, rh - 280);
            ctx.clip();
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.restore();
          } else {
            // Barcode mockup
            ctx.fillStyle = '#2B3550';
            ctx.fillRect(rx + 40, ry + 220, rw - 80, 120);
            ctx.fillStyle = '#ECEEF3';
            for (let i = 0; i < 30; i++) {
              if (i % 3 !== 0) {
                ctx.fillRect(rx + 60 + i * 13, ry + 240, (i % 2 === 0 ? 8 : 4), 80);
              }
            }
          }

          ctx.fillStyle = '#8B93A9';
          ctx.font = 'bold 22px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('AUTHORIZED ACCESS ONLY', rx + rw / 2, ry + rh - 60);
        }
      };

      drawFace(FRONT_UV_RECT, true, fImg);
      drawFace(BACK_UV_RECT, false, bImg);

      const composite = new THREE.CanvasTexture(canvas);
      composite.colorSpace = THREE.SRGBColorSpace;
      composite.flipY = baseMap ? baseMap.flipY : false;
      composite.anisotropy = 16;
      composite.needsUpdate = true;
      return composite;
    };

    // Synchronously set default texture immediately so it is never blank!
    const initialTexture = generateTexture(null, null);
    if (initialTexture) {
      setCardMap(initialTexture);
    }

    if (!frontImage && !backImage) return;

    const loadImage = (src) => {
      if (!src || src === BLANK_PIXEL) return Promise.resolve(null);
      return new Promise((resolve) => {
        const img = new Image();
        if (typeof src === 'string' && src.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    Promise.all([loadImage(frontImage), loadImage(backImage)]).then(([fImg, bImg]) => {
      if (isCancelled) return;
      const updatedTexture = generateTexture(fImg, bImg);
      if (updatedTexture) {
        setCardMap(updatedTexture);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [frontImage, backImage, imageFit, materials?.base?.map]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp?.());
      card.current?.setNextKinematicTranslation?.({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      
      const angvel = card.current.angvel();
      const rotation = card.current.rotation();
      if (angvel && rotation) {
        ang.copy(angvel);
        rot.copy(rotation);
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            {nodes?.card?.geometry && (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardMap || materials?.base?.map || undefined}
                  clearcoat={isMobile ? 0 : 1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
            )}
            {nodes?.clip?.geometry && (
              <mesh geometry={nodes.clip.geometry} material={materials?.metal} />
            )}
            {nodes?.clamp?.geometry && (
              <mesh geometry={nodes.clamp.geometry} material={materials?.metal} />
            )}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
useGLTF.preload(DEFAULT_CARD_GLB);

