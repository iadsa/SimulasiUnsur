import React, { useRef, useState, useEffect } from "react";
import Sketch from "react-p5";
import protonImg from "../assets/proton.png";
import elektronImg from "../assets/elektron.png";
import neutronImg from "../assets/neutron.png";
import wadahImg from "../assets/wadah.png";

const ParticlesComponent = () => {
  const [droppedItems, setDroppedItems] = useState([]);
  const [images, setImages] = useState({});
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const numParticles = 160;
  const center = useRef({ x: 0, y: 0 });
  const circleRadius = useRef(0);

  const items = [
    { type: "proton", label: "Proton", img: protonImg },
    { type: "elektron", label: "Elektron", img: elektronImg },
    { type: "neutron", label: "Neutron", img: neutronImg },
  ];

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

    setDroppedItems((prev) => [
      ...prev,
      { type: data, x: offsetX, y: offsetY },
    ]);
  };

  const handleItemDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleItemDrop = (e) => {
    e.preventDefault();
    const index = e.dataTransfer.getData("index");
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasBounds.left;
    const offsetY = e.clientY - canvasBounds.top;

    const distanceFromCenter = Math.sqrt(
      Math.pow(offsetX - center.current.x, 2) +
        Math.pow(offsetY - center.current.y, 2)
    );

    if (distanceFromCenter <= circleRadius.current) {
      // Jika berada di dalam lingkaran, perbarui posisi
      setDroppedItems((prev) =>
        prev.map((item, i) =>
          i === Number(index) ? { ...item, x: offsetX, y: offsetY } : item
        )
      );
    } else {
      // Jika berada di luar lingkaran, hapus elemen
      setDroppedItems((prev) => prev.filter((_, i) => i !== Number(index)));
    }
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
          new Particle(p5, center.current.x, center.current.y, orbitRadius, angle)
        );
      }
    }
  };

  const draw = (p5) => {
    p5.clear();
  
    // Gambar lingkaran batas (lingkaran terluar)
    p5.noFill();
    p5.stroke(255, 255, 255, 100);
    p5.strokeWeight(2);
    p5.circle(center.current.x, center.current.y, circleRadius.current * 2);
  
    // Lingkaran medium
    p5.stroke(200, 200, 200, 100); // Warna lingkaran medium sedikit lebih gelap
    p5.circle(center.current.x, center.current.y, circleRadius.current * 1.5);
  
    // Lingkaran kecil
    p5.stroke(150, 150, 150, 100); // Warna lingkaran kecil lebih gelap lagi
    p5.circle(center.current.x, center.current.y, circleRadius.current);
  
    // Partikel
    particles.current.forEach((particle) => {
      particle.update();
      particle.display(p5);
    });

    setDroppedItems((prev) =>
  prev.filter((item) => {
    const distanceFromCenter = Math.sqrt(
      Math.pow(item.x - center.current.x, 2) +
      Math.pow(item.y - center.current.y, 2)
    );

    // Gambar elemen yang sudah ditambahkan
  droppedItems.forEach((item) => {
    const image = images[item.type];
    if (image) {
      // Tampilkan gambar elemen
      p5.image(image, item.x - 15, item.y - 15, 30, 30);
    }
  });

  // Tampilkan efek tumpukan jika elemen bertumpuk
  droppedItems.forEach((item, index) => {
    const overlappedItems = droppedItems.filter(
      (other, i) =>
        i !== index &&
        Math.abs(item.x - other.x) < 30 &&
        Math.abs(item.y - other.y) < 30
    );

    if (overlappedItems.length > 0) {
      // Tambahkan transparansi pada gambar elemen
      p5.tint(255, 150); // Transparansi 150 dari 255
      const image = images[item.type];
      if (image) {
        p5.image(image, item.x - 15, item.y - 15, 30, 30);
      }
      p5.noTint(); // Reset transparansi
    }
  });

    // Validasi akses partikel berdasarkan lingkaran
    if (item.type === "elektron") {
      // Elektron dan Proton hanya boleh di lingkaran medium dan terluar
      return distanceFromCenter > circleRadius.current;
    } else if (item.type === "neutron" || item.type === "proton") {
      // Neutron hanya boleh di lingkaran kecil
      return distanceFromCenter <= circleRadius.current;
    }

   

    // Jika tipe tidak dikenali, hapus
    return false;
  })
);

  
    // Gambar elemen yang tersisa
    droppedItems.forEach((item, index) => {
      const image = images[item.type];
      if (image) {
        p5.image(image, item.x - 15, item.y - 15, 30, 30);
  
        // Deteksi klik dan drag ulang
        const distance = Math.sqrt(
          Math.pow(p5.mouseX - item.x, 2) + Math.pow(p5.mouseY - item.y, 2)
        );
  
        if (distance < 15 && p5.mouseIsPressed) {
          const newOffsetX = p5.mouseX;
          const newOffsetY = p5.mouseY;
  
          setDroppedItems((prev) =>
            prev.map((el, i) =>
              i === index ? { ...el, x: newOffsetX, y: newOffsetY } : el
            )
          );
        }
      }
    });
  };
  
  

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight * 0.5);
    center.current = { x: p5.width / 2, y: p5.height / 2 };
    circleRadius.current = Math.min(p5.width, p5.height) / 2.5;
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
  }

  return (
    <div
      className="relative w-full flex flex-col items-center justify-between min-h-[70vh] bg-gradient-to-r from-[#6EABBA] to-[#324D54]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Partikel di tengah */}
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />

      {/* Wadah Proton, Elektron, Neutron */}
      <div
        className="absolute w-full flex justify-center bottom-16 space-x-10"
        style={{
          zIndex: 0,
        }}
      >
        {items.map((item) => (
          <div key={item.type} className="relative flex flex-col items-center">
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
            <h2 className="text-white text-xl font-bold">{item.label}</h2>
          </div>
        ))}
      </div>

      {/* Elemen Proton, Elektron, dan Neutron */}
      <div
        className="absolute w-full flex justify-center items-center space-x-10 gap-10 mb-5 ml-5"
        style={{
          bottom: 110,
          zIndex: 1,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.type}
            className="relative text-center"
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
