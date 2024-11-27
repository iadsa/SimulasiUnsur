import React, { useEffect, useState } from "react";
import { getDeskripsiUnsurData } from "../services/deskripsiApi";

const Deskripsi = ({ atomicNumber }) => {
  const [deskripsi, setDeskripsi] = useState(null); // Inisialisasi dengan null
  const [isLoaded, setIsLoaded] = useState(false); // Status untuk mengecek apakah data sudah dimuat

  useEffect(() => {
    const fetchDeskripsi = async () => {
      try {
        const data = await getDeskripsiUnsurData();
        const elementDeskripsi = data.find(
          (item) => String(item.atomicnumber) === String(atomicNumber)
        );
        setDeskripsi(
          elementDeskripsi ? elementDeskripsi.summary : null
        );
      } catch (err) {
        console.error("Error fetching description data:", err);
        setDeskripsi(null);
      } finally {
        setIsLoaded(true); // Menandakan bahwa data sudah selesai dimuat
      }
    };

    if (atomicNumber) {
      fetchDeskripsi();
    }
  }, [atomicNumber]);

  // Render hanya jika deskripsi sudah tersedia dan isLoaded bernilai true
  if (!isLoaded || !deskripsi) {
    return null; // Tidak render komponen Deskripsi jika data belum ada
  }

  return (
    <div
      className="rounded-lg"
      style={{
        position: "absolute",
        top: "20%",
        left: "10%",
        width: "300px",
        backgroundColor: "#D9D9D9",
        border: "1px solid #C0C0C0",
        padding: "15px",
        boxSizing: "border-box",
        // boxShadow: "0 0 20px 5px #C0C0C0",
        overflow: "hidden",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>
        Deskripsi
      </h2>
      <p>{deskripsi}</p>
    </div>
  );
};

export default Deskripsi;
