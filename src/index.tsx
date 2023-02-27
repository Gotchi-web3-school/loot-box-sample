import "./style.css"
import ReactDOM from 'react-dom/client';
import App from './App';
import { Canvas } from "@react-three/fiber";
import React from "react";
import { ChakraProvider } from '@chakra-ui/react'


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Canvas camera={{ fov: 45, far: 1000, position: [0, 3, 10] }} >
          <App />
      </Canvas>
    </ChakraProvider>

      <div className="overlay"></div>
      <h1 id="progress">Loading... <span id="progressPercentage"></span>%</h1>
      <button className="start">START</button>
  </React.StrictMode>
);

