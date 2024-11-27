export const getDeskripsiUnsurData = async () => {
    try {
      const response = await fetch(`/SimulasiUnsur/api/deskripsi.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); 
      if (Array.isArray(data)) {
        return data;  
        throw new Error("Data JSON bukan array");
      }
    } catch (error) {
      console.error("Error fetching data:", error);  
      throw new Error("Network Error. Please check your connection or API URL.");
    }
  };
  