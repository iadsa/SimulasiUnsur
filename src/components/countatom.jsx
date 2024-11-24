import React from "react";
import plusImg from "../assets/plus.png";
import minusImg from "../assets/minus.png";

const CountAtom = ({ type, value, onUpdate }) => {
  const handleUpdate = (increment) => {
    const newValue = Math.max(0, value + increment);
    onUpdate(type, newValue);
  };

  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      <div
        className="flex items-center justify-between bg-[#D9D9D9] rounded-lg"
        style={{ width: "136.49px", height: "33.28px" }}
      >
        <button
          onClick={() => handleUpdate(-1)}
          className="h-full w-[30px] flex items-center justify-center"
        >
          <img src={minusImg} alt="Minus" />
        </button>
        <div
          className="text-center w-[60px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#000000",
            textShadow: "2px 2px 0px #ffffff, -2px -2px 0px #ffffff, 2px -2px 0px #ffffff, -2px 2px 0px #ffffff",
          }}
        >
          {value}
        </div>
        <button
          onClick={() => handleUpdate(1)}
          className="h-full w-[30px] flex items-center justify-center"
        >
          <img src={plusImg} alt="Plus" />
        </button>
      </div>
    </div>
  );
};

export default CountAtom;
