import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import styled from "styled-components";
import React from "react";

const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  position: relative;

  /* Make canvas fill the container */
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorContainer = styled(LoadingContainer)`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

function Model({ url, onError }) {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (gltf) {
        if (gltf.scene) {
          gltf.scene.traverse((object) => {
            if (object.isMesh) {
              if (object.geometry) {
                object.geometry.dispose();
              }
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((material) => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            }
          });
        }
      }
    };
  }, [gltf]);

  if (!gltf || !gltf.scene) {
    onError(new Error("Invalid model data"));
    return null;
  }

  // Create a clone of the scene to prevent sharing between instances
  const clonedScene = gltf.scene.clone(true);
  return <primitive object={clonedScene} />;
}

function ModelViewer({ url }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <ViewerContainer>
        <ErrorContainer>
          <div>Failed to load 3D model</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            The model might be unavailable or in an unsupported format
          </div>
        </ErrorContainer>
      </ViewerContainer>
    );
  }

  return (
    <ViewerContainer>
      <Canvas
        shadows
        camera={{
          fov: 45,
        }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Stage intensity={0.6}>
            <Model url={url} onError={setError} />
          </Stage>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={100}
          />
        </Suspense>
      </Canvas>
    </ViewerContainer>
  );
}

function ModelViewerWithFallback({ url }) {
  if (!url) {
    return (
      <ViewerContainer>
        <LoadingContainer>No 3D model available</LoadingContainer>
      </ViewerContainer>
    );
  }

  return (
    <Suspense
      fallback={
        <ViewerContainer>
          <LoadingContainer>Loading 3D model...</LoadingContainer>
        </ViewerContainer>
      }
    >
      <ErrorBoundary
        fallback={
          <ViewerContainer>
            <ErrorContainer>
              <div>Failed to load 3D model</div>
              <div
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                The model might be unavailable or in an unsupported format
              </div>
            </ErrorContainer>
          </ViewerContainer>
        }
      >
        <ModelViewer url={url} />
      </ErrorBoundary>
    </Suspense>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Model Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ModelViewerWithFallback;
