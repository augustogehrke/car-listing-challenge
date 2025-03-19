import { useState } from "react";

export default function FileUpload() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setMessage("Please select a file.");
      event.target.value = "";
      return;
    }
  
    if (file.size > 10 * 1024 * 1024) {
      setMessage("File size exceeds 10MB limit.");
      event.target.value = "";
      return;
    }

    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const contentDisposition: string | null = response.headers.get("Content-Disposition");

        if (contentDisposition?.includes("attachment")) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "car-upload-errors.xlsx";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

          setMessage("Errors found. Please correct them in the downloaded file and re-upload.");
          setIsSuccess(false);
        } else {
          setMessage("File processed successfully! All data saved to the database.");
          setIsSuccess(true);
        }
      } else {
        const result = await response.json();
        setMessage(result.error);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Unexpected error while uploading the file.");
      setIsSuccess(false);
    } finally {
      event.target.value = "";
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md flex flex-col items-center space-y-4">
      <h2 className="text-lg font-semibold">Upload Excel File</h2>

      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} className="mb-2" />

      {loading && <p className="text-blue-500">Processing file...</p>}

      {message && (
        <p className={`text-center ${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
