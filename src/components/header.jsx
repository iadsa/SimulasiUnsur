import React from "react";
import atomImage from "../assets/atom.png";

const Header = () => {
  return (
    <header className="relative text-center mt-8 z-10 px-4">
      {/* Teks SIMULASI */}
      <h1
        className="text-[69px] font-bold text-white"
        style={{
          fontFamily: "'Bungee', cursive",
          WebkitTextStroke: "2px #003D3F",
          textShadow: "4px 4px 6px rgba(0, 0, 0, 0.5)",
        }}
      >
        SIMULASI
      </h1>

      {/* Container untuk ATOM dan gambar */}
      <div className="flex items-center justify-center mt-4">
        <h2
          className="text-[56px] text-white mr-4"
          style={{
            fontFamily: "'Gugi', cursive",
            WebkitTextStroke: "2px #003D3F",
            textShadow: "4px 4px 6px rgba(0, 0, 0, 0.5)",
          }}
        >
          ATOM
        </h2>
        <img
          src={atomImage}
          alt="Atom"
          className="w-24 h-24 animate-spin"
          style={{
            animationDuration: "3s",
            animationTimingFunction: "linear",
          }}
        />
      </div>
    </header>
  );
};

export default Header;
