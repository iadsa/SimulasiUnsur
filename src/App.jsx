import React from "react";
import ParticlesComponent from "./components/particles.jsx";
import DragDropComponent from "./components/dragdrop.jsx";
import Header from "./components/header.jsx";

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#6EABBA] to-[#324D54] flex flex-col items-center justify-start overflow-hidden">
      {/* Header Component */}
      <Header />

      {/* Particles Component */}
      <div className="relative w-full flex-1 flex items-center justify-center z-0 mt-6 mb-8 overflow-hidden">
        <ParticlesComponent />
      </div>

      {/* Drag and Drop Component */}
      <div className="relative w-full flex justify-center mt-4 z-10 mb-10">
        <DragDropComponent />
      </div>
    </div>
  );
}

export default App;
