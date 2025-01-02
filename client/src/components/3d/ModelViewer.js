import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
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
  const gltf = useGLTF(url);

  if (!gltf || !gltf.scene) {
    onError(new Error("Invalid model data"));
    return null;
  }

  return <primitive object={gltf.scene} />;
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
