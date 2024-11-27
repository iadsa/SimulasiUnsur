import React, { useEffect, useState } from "react";
import { getUnsurData } from "../services/unsurapi";
import { getImageUnsurData } from "../services/gambarApi";

const Unsur = ({ atomicNumber }) => {
  const [unsur, setUnsur] = useState(null);
  const [error, setError] = useState(false);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const fetchUnsur = async () => {
      try {
        const data = await getUnsurData();
        const element = data.find((item) => item.atomicNumber === atomicNumber);

        if (element) {
          setUnsur(element);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      }
    };

    if (atomicNumber) {
      fetchUnsur();
    }
  }, [atomicNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getImageUnsurData();
        setElements(data);
      } catch (err) {
        console.error("Error fetching image data:", err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Unsur tidak ditemukan.</p>;
  }

  if (!unsur) {
    return <p>Loading...</p>;
  }

  const image = elements.find((element) => String(element.atomicNumber) === String(atomicNumber))?.["image.url"];

  const {
    atomicNumber: noAtom,
    symbol,
    name,
    atomicMass,
    electronicConfiguration,
    atomicRadius,
    ionizationEnergy,
    meltingPoint,
    boilingPoint,
    groupBlock,
  } = unsur;

  const jumlahNeutron = Math.round(atomicMass - noAtom);
  const jumlahElektron = noAtom; 

  // Isotop, Isobar, Stabil/Instabil (Contoh aturan sederhana)
  const isIsotop = atomicMass > noAtom ? "Isotop" : "-";
  const isIsobar = elements.some(el => el.atomicMass === atomicMass && el.atomicNumber !== noAtom) ? "Isobar" : "-";
  const isStable = atomicMass % 2 === 0 ? "Stable" : "Unstable"; // Contoh rule sederhana, sesuaikan dengan kondisi nyata

  return (
    <div
      className="rounded-lg"
      style={{
        width: "450px",
        backgroundColor: "#D9D9D9",
        border: "1px solid #C0C0C0",
        padding: "15px",
        boxSizing: "border-box",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        display: "flex", 
        flexDirection: "row", // Posisi item di sebelah kiri-kanan
        justifyContent: "space-between", // Memisahkan gambar dan teks
        alignItems: "center", // Menjaga elemen vertikal sejajar
      }}
    >
      <div style={{ flex: 1 }}> {/* Konten teks di sebelah kiri */}
        <h1 className="ml-10" 
        style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold", fontSize: "15px" }}>
          {symbol} - {name}
        </h1>
        <p><strong>Nomor Atom:</strong> {noAtom}</p>
        <p><strong>Massa Atom:</strong> {atomicMass}</p>
        <p><strong>Konfigurasi Elektron:</strong> {electronicConfiguration}</p>
        <p><strong>Jari-jari Atom:</strong> {atomicRadius || "N/A"} pm</p>
        <p><strong>Energi Ionisasi:</strong> {ionizationEnergy || "N/A"} kJ/mol</p>
        <p><strong>Titik Leleh:</strong> {meltingPoint || "N/A"} K</p>
        <p><strong>Titik Didih:</strong> {boilingPoint || "N/A"} K</p>
        <p><strong>Golongan:</strong> {groupBlock || "N/A"}</p>
        <p><strong>Jumlah Proton:</strong> {noAtom}</p>
        <p><strong>Jumlah Neutron:</strong> {jumlahNeutron}</p>
        <p><strong>Jumlah Elektron:</strong> {jumlahElektron}</p>
        
        {/* Kategori Isotop, Isobar, Stabil */}
        <p><strong>Isotop:</strong> {isIsotop}</p>
        <p><strong>Isobar:</strong> {isIsobar}</p>
        <p><strong>Status:</strong> {isStable}</p>
      </div>
      
      {/* Gambar di sebelah kanan */}
      {image && (
        <img
          src={image}
          alt={unsur.name}
          style={{ width: "100px", height: "100px", margin: "10px 0", backgroundColor: "rgba(255, 255, 255, 0)" }}
        />
      )}
    </div>
  );
};

export default Unsur;
