export const getImageUnsurData = async () => {
  try {
    const response = await fetch("../api/gambarunsur.json");  // Pastikan path ini benar
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); 
    if (Array.isArray(data)) {
      return data;  // Data gambar berhasil diambil dan diformat sebagai array
    } else {
      throw new Error("Data JSON bukan array");
    }
  } catch (error) {
    console.error("Error fetching data:", error);  // Log error untuk pemeriksaan lebih lanjut
    throw new Error("Network Error. Please check your connection or API URL.");
  }
};
