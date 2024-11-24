import React, { useState } from "react";
import plusImg from "../assets/plus.png";
import minusImg from "../assets/minus.png";

const CountAtom = ({ onUpdate }) => {
  const [counts, setCounts] = useState({
    proton: 0,
    neutron: 0,
    elektron: 0,
  });

  const handleUpdate = (type, value) => {
    setCounts((prevCounts) => {
      const newValue = Math.max(0, prevCounts[type] + value);
      const newCounts = { ...prevCounts, [type]: newValue };
      onUpdate(type, newValue);
      return newCounts;
    });
  };

  const items = [
    { label: "Proton", type: "proton" },
    { label: "Neutron", type: "neutron" },
    { label: "Elektron", type: "elektron" },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {items.map((item) => (
        <div
          key={item.type}
          className="flex items-center justify-between bg-[#BDBDBD] rounded-lg"
          style={{ width: "136.49px", height: "33.28px" }}
        >
          <button
            onClick={() => handleUpdate(item.type, -1)}
            className="h-full w-[30px] flex items-center justify-center"
          >
            <img src={minusImg} alt="Minus" />
          </button>
          <div className="text-black text-center w-[60px]">
            {counts[item.type]}
          </div>
          <button
            onClick={() => handleUpdate(item.type, 1)}
            className="h-full w-[30px] flex items-center justify-center"
          >
            <img src={plusImg} alt="Plus" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CountAtom;
