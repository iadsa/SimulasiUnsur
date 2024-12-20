import React, { useRef, useState, useEffect } from "react";
import Sketch from "react-p5";
import protonImg from "../assets/proton.png";
import elektronImg from "../assets/elektron.png";
import neutronImg from "../assets/neutron.png";
import wadahImg from "../assets/wadah.png";
import CountAtom from "./countatom";
import Unsur from "../components/unsur";
import Deskripsi from "../components/deskripsi";
const ParticlesComponent = () => {
  const [droppedItems, setDroppedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [images, setImages] = useState({});
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const numParticles = 160;
  const center = useRef({ x: 0, y: 0 });
  const circleRadius = useRef(0);

  const calculateAtomicNumber = () => {
    return counts.proton; // Asumsikan nomor atom dihitung dari jumlah proton
  };

  const calculateMassNumber = () => {
    // Mass number dihitung dengan jumlah proton dan neutron
    return counts.proton + counts.neutron;
  };

  const items = [
    { type: "proton", label: "Proton", img: protonImg },
    { type: "elektron", label: "Elektron", img: elektronImg },
    { type: "neutron", label: "Neutron", img: neutronImg },
  ];

  const [counts, setCounts] = useState({
    proton: 0,
    neutron: 0,
    elektron: 0,
  });

  const updateParticleCounts = (type, delta) => {
    setCounts((prevCounts) => {
      const newValue = Math.max(0, prevCounts[type] + delta);
      return { ...prevCounts, [type]: newValue };
    });
  };

  useEffect(() => {
    // Perbarui droppedItems untuk mencocokkan jumlah partikel
    const updatedItems = [];

    // Tambahkan proton
    for (let i = 0; i < counts.proton; i++) {
      updatedItems.push({
        type: "proton",
        x: center.current.x + Math.random() * 20 - 10,
        y: center.current.y + Math.random() * 20 - 10,
      });
    }

    // Tambahkan neutron
    for (let i = 0; i < counts.neutron; i++) {
      updatedItems.push({
        type: "neutron",
        x: center.current.x + Math.random() * 20 - 10,
        y: center.current.y + Math.random() * 20 - 10,
      });
    }

    // Tambahkan elektron
    const orbitRadii = [
      circleRadius.current,
      circleRadius.current * 0.75,
      circleRadius.current * 0.5,
    ];

    for (let i = 0; i < counts.elektron; i++) {
      const radius = orbitRadii[i % orbitRadii.length];
      const angle = (Math.PI * 2 * i) / counts.elektron;
      updatedItems.push({
        type: "elektron",
        x: center.current.x + radius * Math.cos(angle),
        y: center.current.y + radius * Math.sin(angle),
      });
    }

    setDroppedItems(updatedItems);
  }, [counts, center, circleRadius]);

  useEffect(() => {
    const loadImages = (p5) => {
      setImages({
        proton: p5.loadImage(protonImg),
        elektron: p5.loadImage(elektronImg),
        neutron: p5.loadImage(neutronImg),
      });
    };

    if (!canvasRef.current) {
      new window.p5((p) => loadImages(p));
    }
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("item");
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasBounds.left;
    const offsetY = e.clientY - canvasBounds.top;

    const distanceFromCenter = Math.sqrt(
      Math.pow(offsetX - center.current.x, 2) +
        Math.pow(offsetY - center.current.y, 2)
    );

    // Logika untuk Proton dan Neutron
    if (data === "proton" || data === "neutron") {
      if (distanceFromCenter > circleRadius.current / 2) {
        console.log("Proton/Neutron hanya boleh berada di pusat lingkaran");
        return; // Proton atau Neutron hanya diperbolehkan di tengah
      }

      setDroppedItems((prev) => [
        ...prev,
        { type: data, x: offsetX, y: offsetY },
      ]);
      updateParticleCounts(data, 1); // Tambahkan 1 untuk jenis partikel ini
      return;
    }

    // Logika untuk Elektron
    if (data === "elektron") {
      const orbitRadii = [
        circleRadius.current, // Lingkaran luar
        circleRadius.current * 0.75, // Lingkaran medium
        circleRadius.current * 0.5, // Lingkaran kecil
      ];

      // Cari radius lingkaran terdekat
      let closestRadius = orbitRadii[0];
      orbitRadii.forEach((radius) => {
        if (
          Math.abs(distanceFromCenter - radius) <
          Math.abs(distanceFromCenter - closestRadius)
        ) {
          closestRadius = radius;
        }
      });

      const angle = Math.atan2(
        offsetY - center.current.y,
        offsetX - center.current.x
      );
      const snappedX = center.current.x + closestRadius * Math.cos(angle);
      const snappedY = center.current.y + closestRadius * Math.sin(angle);

      setDroppedItems((prev) => [
        ...prev,
        { type: data, x: snappedX, y: snappedY },
      ]);
      updateParticleCounts(data, 1); // Tambahkan 1 untuk elektron
      return;
    }

    // Tambahkan partikel lainnya secara default
    setDroppedItems((prev) => [
      ...prev,
      { type: data, x: offsetX, y: offsetY },
    ]);
    updateParticleCounts(data, 1); // Tambahkan 1 untuk jenis partikel ini
  };

  const onDragStart = (e, itemType) => {
    e.dataTransfer.setData("item", itemType);
  };

  const setup = (p5, canvasParentRef) => {
    if (!canvasRef.current) {
      const canvas = p5
        .createCanvas(p5.windowWidth, p5.windowHeight * 0.5)
        .parent(canvasParentRef);
      canvasRef.current = p5._renderer.canvas;

      center.current = { x: p5.width / 2, y: p5.height / 2 };
      circleRadius.current = Math.min(p5.width, p5.height) / 2.5;

      for (let i = 0; i < numParticles; i++) {
        const orbitRadius = p5.random(100, circleRadius.current);
        const angle = p5.random(p5.TWO_PI);
        particles.current.push(
          new Particle(
            p5,
            center.current.x,
            center.current.y,
            orbitRadius,
            angle
          )
        );
      }
    }
  };

  const draw = (p5) => {
    p5.clear();

    // Gambar lingkaran batas
    p5.noFill();
    p5.stroke(255, 255, 255, 100);
    p5.strokeWeight(2);
    p5.circle(center.current.x, center.current.y, circleRadius.current * 2);

    // Lingkaran medium
    p5.stroke(200, 200, 200, 100);
    p5.circle(center.current.x, center.current.y, circleRadius.current * 1.5);

    // Lingkaran kecil
    p5.stroke(150, 150, 150, 100);
    p5.circle(center.current.x, center.current.y, circleRadius.current);

    // Partikel animasi
    particles.current.forEach((particle) => {
      particle.update();
      particle.display(p5);
    });

    droppedItems.forEach((item, index) => {
      const image = images[item.type];
      if (image) {
        p5.image(image, item.x - 15, item.y - 15, 30, 30);

        // Periksa klik mouse pada elemen
        if (
          p5.mouseIsPressed &&
          p5.mouseX >= item.x - 15 &&
          p5.mouseX <= item.x + 15 &&
          p5.mouseY >= item.y - 15 &&
          p5.mouseY <= item.y + 15
        ) {
          setSelectedItem({
            index,
            offsetX: p5.mouseX - item.x,
            offsetY: p5.mouseY - item.y,
          });
        }
      }
    });

    // Pada fungsi draw
    if (selectedItem) {
      const { index, offsetX, offsetY } = selectedItem;
      const newX = p5.mouseX - offsetX;
      const newY = p5.mouseY - offsetY;

      const item = droppedItems[index];
      const distanceFromCenter = Math.sqrt(
        Math.pow(newX - center.current.x, 2) +
          Math.pow(newY - center.current.y, 2)
      );

      if (item.type === "proton" || item.type === "neutron") {
        if (distanceFromCenter <= circleRadius.current / 2) {
          setDroppedItems((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, x: newX, y: newY } : item
            )
          );
        }
      } else if (item.type === "elektron") {
        const orbitRadii = [
          circleRadius.current, // Lingkaran luar
          circleRadius.current * 0.75, // Lingkaran medium
          circleRadius.current * 0.5, // Lingkaran kecil
        ];

        let closestRadius = orbitRadii[0];
        let minDistance = Math.abs(distanceFromCenter - closestRadius);

        orbitRadii.forEach((radius) => {
          const distance = Math.abs(distanceFromCenter - radius);
          if (distance < minDistance) {
            closestRadius = radius;
            minDistance = distance;
          }
        });

        const angle = Math.atan2(
          newY - center.current.y,
          newX - center.current.x
        );
        const snappedX = center.current.x + closestRadius * Math.cos(angle);
        const snappedY = center.current.y + closestRadius * Math.sin(angle);

        setDroppedItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, x: snappedX, y: snappedY } : item
          )
        );
      }
    }

    // Lepaskan elemen saat mouse dilepas
    if (!p5.mouseIsPressed && selectedItem) {
      setSelectedItem(null);
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight * 0.5);
    const newCenter = { x: p5.width / 2, y: p5.height / 2 };
    const newCircleRadius = Math.min(p5.width, p5.height) / 2.5;

    // Update center and circle radius
    center.current = newCenter;
    circleRadius.current = newCircleRadius;

    // Adjust positions of dropped items
    setDroppedItems((prevItems) =>
      prevItems.map((item) => {
        const angle = Math.atan2(
          item.y - center.current.y,
          item.x - center.current.x
        );
        const distanceFromCenter = Math.sqrt(
          Math.pow(item.x - center.current.x, 2) +
            Math.pow(item.y - center.current.y, 2)
        );

        let newX, newY;
        if (item.type === "proton" || item.type === "neutron") {
          newX =
            center.current.x +
            (distanceFromCenter / circleRadius.current) *
              newCircleRadius *
              Math.cos(angle);
          newY =
            center.current.y +
            (distanceFromCenter / circleRadius.current) *
              newCircleRadius *
              Math.sin(angle);
        } else if (item.type === "elektron") {
          const orbitRadii = [
            newCircleRadius, // Lingkaran luar
            newCircleRadius * 0.75, // Lingkaran medium
            newCircleRadius * 0.5, // Lingkaran kecil
          ];

          let closestRadius = orbitRadii[0];
          let minDistance = Math.abs(distanceFromCenter - closestRadius);

          orbitRadii.forEach((radius) => {
            const distance = Math.abs(distanceFromCenter - radius);
            if (distance < minDistance) {
              closestRadius = radius;
              minDistance = distance;
            }
          });

          newX = center.current.x + closestRadius * Math.cos(angle);
          newY = center.current.y + closestRadius * Math.sin(angle);
        }

        return { ...item, x: newX, y: newY };
      })
    );

    particles.current.forEach((particle) => {
      const newOrbitRadius = p5.random(100, circleRadius.current);
      particle.updateProperties(
        center.current.x,
        center.current.y,
        newOrbitRadius
      );
    });
  };

  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
  }, []);

  class Particle {
    constructor(p5, centerX, centerY, orbitRadius, angle) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.orbitRadius = orbitRadius;
      this.angle = angle;
      this.angleSpeed = p5.random(0.0005, 0.0001);
      this.size = p5.random(10, 10);
    }

    update() {
      this.angle += this.angleSpeed;
    }

    display(p5) {
      const x = this.centerX + this.orbitRadius * Math.cos(this.angle);
      const y = this.centerY + this.orbitRadius * Math.sin(this.angle);

      p5.noStroke();
      p5.fill(255, 255, 255, 200);
      p5.circle(x, y, this.size);
    }

    updateProperties(centerX, centerY, orbitRadius) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.orbitRadius = orbitRadius;
    }
  }

  return (
    <div
      className="relative w-full flex flex-col items-center justify-between min-h-[70vh] bg-gradient-to-r from-[#6EABBA] to-[#324D54] mt-6 mb-8 overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Partikel di tengah */}
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />

      {/* Kotak Deskirpsi */}
      <div
        className="absolute top-1/6 left-24 transform -translate-y-1/2 translate-x-0 border-2 rounded-lg ml-10"
        style={{
          borderRadius: "15px",
          // boxShadow: "0 0 20px 5px #C0C0C0",
          left: "10%",
          top: "2%",
          fontSize: "18px",
          fontFamily: "Inter",
        }}
      >
        <Deskripsi
          atomicNumber={calculateAtomicNumber()}
          massNumber={calculateMassNumber()}
          electrons={counts.elektron}
        />
      </div>

      {/* Kotak Unsur */}
      <div
        className="absolute top-1/4 right-24 transform -translate-y-1/2 -translate-x-24 border-2 rounded-lg mr-10 mb-10 mt-10"
        style={{
          borderRadius: "15px",
          // boxShadow: "0 0 20px 5px #C0C0C0",
          right: "-2%",
         
          fontFamily: "Inter",
        }}
      >
        <Unsur
          atomicNumber={calculateAtomicNumber()}
          massNumber={calculateMassNumber()}
          electrons={counts.elektron}
        />
      </div>

      {/* Wadah Proton, Elektron, Neutron */}
      <div
        className="absolute w-full flex justify-center bottom-1 space-x-10 mt-10"
        style={{
          zIndex: 0,
        }}
      >
        {items.map((item) => (
          <div
            key={item.type}
            className="relative flex flex-col items-center mt-4"
          >
            <div
              style={{
                width: "100px",
                height: "50px",
                backgroundImage: `url(${wadahImg})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                marginBottom: "20px",
              }}
            ></div>
            <h2 className="text-white text-xl font-bold ">{item.label}</h2>
            {/* Tambahkan CountAtom di bawah elemen h2 */}
            <CountAtom
              type={item.type}
              value={counts[item.type]}
              onUpdate={(type, value) => {
                const delta = value - counts[type];
                updateParticleCounts(type, delta);
              }}
            />
          </div>
        ))}
      </div>

      {/* Elemen Proton, Elektron, dan Neutron */}
      <div
        className="flex justify-center items-center center absolute gap-20 ml-14 mr-10 mt-10 -mb-2"
        style={{
          bottom: 110,
          zIndex: 1,
          button: "15px",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.type}
            className="relative text-center mt"
            style={{
              marginLeft: `${index * 35}px`,
              marginRight: `${(items.length - index) * 4}px`,
            }}
          >
            <img
              src={item.img}
              alt={item.label}
              draggable="true"
              onDragStart={(e) => onDragStart(e, item.type)}
              className="w-10 h-10 bg-white rounded-full"
              style={{
                right: `${index * 10}px`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticlesComponent;
