import React from "react";
import ParticlesComponent from "./components/particles.jsx";
import DragDropComponent from "./components/dragdrop.jsx";
import Header from "./components/header.jsx";

function App() {
  const scale = 0.90; // Skala otomatis (85%)

  // Perhitungan otomatis untuk width dan height
  const scaleStyle = {
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    width: `${100 / scale}%`, // Kompensasi otomatis untuk lebar
    height: `${100 / scale}%`, // Kompensasi otomatis untuk tinggi
    overflow: "hidden",
  };

  return (
    <div
      style={scaleStyle}
      className="relative min-h-screen bg-gradient-to-r from-[#6EABBA] to-[#324D54] flex flex-col items-center justify-start "
    >
      {/* Header */}
      <div className="mt-4">
      <Header />

      </div>

      {/* Particles */}
      <div className="relative w-full flex-1 flex items-center justify-center z-0 mt-6 mb-20">
        <ParticlesComponent />
      </div>

      {/* Drag and Drop */}
      <div className="w-full flex justify-center mt-4 z-10 mt-20"      
      >
        <DragDropComponent />
      </div>
    </div>
  );
}

export default App;
