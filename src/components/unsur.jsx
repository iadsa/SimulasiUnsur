import React, { useEffect, useState } from "react";
import { getUnsurData } from "../services/unsurapi";

const Unsur = ({ atomicNumber }) => {
  const [unsur, setUnsur] = useState(null);
  const [error, setError] = useState(false);

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

  if (error) {
    return <p style={{ color: "red" }}>Unsur tidak ditemukan.</p>;
  }

  if (!unsur) {
    return <p>Loading...</p>;
  }

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

  // Menghitung jumlah neutron berdasarkan massa atom dan nomor atom
  const jumlahNeutron = Math.round(atomicMass - noAtom); // Pembulatan untuk nilai neutron

  return (
    <div
      className="rounded-lg"
      style={{
        width: "350px",
        backgroundColor: "#D9D9D9",
        border: "1px solid #C0C0C0",
        padding: "15px",
        boxSizing: "border-box",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        {symbol} - {name}
      </h2>
      <p><strong>Nomor Atom:</strong> {noAtom}</p>
      <p><strong>Massa Atom:</strong> {atomicMass}</p>
      <p><strong>Konfigurasi Elektron:</strong> {electronicConfiguration}</p>
      <p><strong>Jari-jari Atom:</strong> {atomicRadius || "N/A"} pm</p>
      <p><strong>Energi Ionisasi:</strong> {ionizationEnergy || "N/A"} kJ/mol</p>
      <p><strong>Titik Leleh:</strong> {meltingPoint || "N/A"} K</p>
      <p><strong>Titik Didih:</strong> {boilingPoint || "N/A"} K</p>
      <p><strong>Golongan:</strong> {groupBlock || "N/A"}</p>
      <p><strong>Jumlah Protom:</strong> {noAtom}</p> {/* Jumlah Proton = Nomor Atom */}
      <p><strong>Jumlah Neutron:</strong> {jumlahNeutron}</p> {/* Perhitungan Neutron */}
    </div>
  );
};

export default Unsur;
