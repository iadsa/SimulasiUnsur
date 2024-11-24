import React from "react";
import PropTypes from "prop-types";
import protonImg from "../assets/proton.png";
import neutronImg from "../assets/neutron.png";
import elektronImg from "../assets/elektron.png";
import wadahImg from "../assets/wadah.png";

const DragDropComponent = React.memo(({ onDragStart }) => {
  const items = [
    { type: "proton", label: "Proton", img: protonImg },
    { type: "elektron", label: "Elektron", img: elektronImg },
    { type: "neutron", label: "Neutron", img: neutronImg },
  ];

  return (
    <div className="flex justify-center items-center w-full max-w-screen-lg p-8 space-x-8 relative">
      {/* Wadah di bawah semua elemen */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: "300px",
          height: "150px",
          backgroundImage: `url(${wadahImg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1, // Pastikan wadah berada di bawah elemen lainnya
        }}
      ></div>

      {items.map((item) => (
        <div key={item.type} className="relative text-center">
          <h2 className="text-white text-xl font-inter font-bold mb-4">
            {item.label}
          </h2>
          <img
            src={item.img}
            alt={item.label}
            draggable="true"
            onDragStart={(e) => {
              if (typeof onDragStart === "function") {
                onDragStart(e, item.type);
              } else {
                console.error("onDragStart is not a function");
              }
            }}
            className="w-16 h-16 bg-white rounded-full relative"
          />
        </div>
      ))}
    </div>
  );
});

DragDropComponent.propTypes = {
  // onDragStart: PropTypes.func.isRequired,
};

export default DragDropComponent;
