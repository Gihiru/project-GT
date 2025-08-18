import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ElectricitySparks = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const isDarkMode = !document.documentElement.classList.contains('light');
    if (!isDarkMode) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(800, 600);
    renderer.setClearColor(0x000000, 0);
    mountRef.current?.appendChild(renderer.domElement);
    camera.position.z = 8;

    const createLightningPath = (startX, startY, endX, endY, segments) => {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 0.8 * (1 - Math.abs(t - 0.5) * 2);
        const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 0.6 * (1 - Math.abs(t - 0.5) * 2);
        points.push(new THREE.Vector3(x, y, 0));
      }
      return points;
    };

    const createSpark = () => {
      const sparkGroup = new THREE.Group();
      
      // Main lightning bolt
      const mainPath = createLightningPath(-6, 4, 6, -4, 40);
      
      // Create glow layers for realistic effect
      const layers = [
        { color: 0xffffff, opacity: 1.0, width: 1 },    // Core
        { color: 0xffee88, opacity: 0.8, width: 2 },    // Inner glow
        { color: 0xffcc44, opacity: 0.6, width: 3 },    // Mid glow
        { color: 0xff8800, opacity: 0.3, width: 4 },    // Outer glow
        { color: 0xff4400, opacity: 0.1, width: 6 }     // Far glow
      ];
      
      const mainLines = [];
      layers.forEach(layer => {
        const material = new THREE.LineBasicMaterial({ 
          color: layer.color, 
          transparent: true, 
          opacity: 0,
          linewidth: layer.width
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(mainPath);
        const line = new THREE.Line(geometry, material);
        sparkGroup.add(line);
        mainLines.push({ line, baseOpacity: layer.opacity });
      });
      
      // Create branches
      const branches = [];
      for (let i = 5; i < mainPath.length - 5; i += 3) {
        if (Math.random() < 0.4) {
          const branchStart = mainPath[i];
          const branchEnd = new THREE.Vector3(
            branchStart.x + (Math.random() - 0.5) * 3,
            branchStart.y + (Math.random() - 0.5) * 2,
            0
          );
          const branchPath = createLightningPath(
            branchStart.x, branchStart.y,
            branchEnd.x, branchEnd.y,
            8
          );
          
          const branchMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffaa33, 
            transparent: true, 
            opacity: 0 
          });
          const branchGeometry = new THREE.BufferGeometry().setFromPoints(branchPath);
          const branchLine = new THREE.Line(branchGeometry, branchMaterial);
          sparkGroup.add(branchLine);
          branches.push(branchLine);
        }
      }
      
      scene.add(sparkGroup);
      sparksRef.current.push({ 
        group: sparkGroup,
        mainLines,
        branches,
        startTime: Date.now(),
        duration: 3000
      });
    };

    const animate = () => {
      const currentTime = Date.now();
      
      sparksRef.current.forEach((spark, index) => {
        const elapsed = currentTime - spark.startTime;
        const progress = Math.min(elapsed / spark.duration, 1);
        
        if (progress < 0.1) {
          // Flash appearance
          const intensity = progress / 0.1;
          spark.mainLines.forEach(({ line, baseOpacity }) => {
            line.material.opacity = baseOpacity * intensity * 2;
          });
          spark.branches.forEach(branch => {
            branch.material.opacity = 0.7 * intensity;
          });
        } else if (progress < 0.9) {
          // Flickering phase
          const flicker = 0.3 + Math.random() * 0.7;
          const pulseIntensity = Math.sin(elapsed * 0.02) * 0.3 + 0.7;
          
          spark.mainLines.forEach(({ line, baseOpacity }) => {
            line.material.opacity = baseOpacity * flicker * pulseIntensity;
          });
          spark.branches.forEach(branch => {
            branch.material.opacity = 0.5 * flicker * (0.5 + Math.random() * 0.5);
          });
        } else {
          // Fade out
          const fadeIntensity = (1 - progress) / 0.1;
          spark.mainLines.forEach(({ line, baseOpacity }) => {
            line.material.opacity = baseOpacity * fadeIntensity;
          });
          spark.branches.forEach(branch => {
            branch.material.opacity = 0.5 * fadeIntensity;
          });
        }
        
        if (progress >= 1) {
          scene.remove(spark.group);
          sparksRef.current.splice(index, 1);
        }
      });
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    setTimeout(() => {
      if (!document.documentElement.classList.contains('light')) {
        createSpark();
      }
    }, 1000);
    
    const sparkInterval = setInterval(() => {
      if (!document.documentElement.classList.contains('light')) {
        createSpark();
      }
    }, 5000);

    animate();

    return () => {
      clearInterval(sparkInterval);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'screen', filter: 'blur(0.5px) brightness(1.8)' }}
    />
  );
};

export default ElectricitySparks;