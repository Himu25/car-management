"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { revalidateTag } from "next/cache";

export default function CarForm({ closeModal, carData, mode }) {
  const [carName, setCarName] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [carType, setCarType] = useState("");
  const [carCompany, setCarCompany] = useState("");
  const [dealer, setDealer] = useState("");
  const [images, setImages] = useState([{ image_id: 1, image_url: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "update" && carData) {
      setCarName(carData.car_name || "");
      setTags(carData.tags || "");
      setDescription(carData.description || "");
      setCarType(carData.car_type || "");
      setCarCompany(carData.car_company || "");
      setDealer(carData.dealer || "");
      setImages(
        carData.images
          ? carData.images.map((img, index) => ({
              ...img,
              image_id: index + 1,
            }))
          : [{ image_id: 1, image_url: "" }]
      );
    } else {
      setCarName("");
      setTags("");
      setDescription("");
      setCarType("");
      setCarCompany("");
      setDealer("");
      setImages([{ image_id: 1, image_url: "" }]);
    }
  }, [carData, mode]);

  const handleAddImage = () => {
    setImages([...images, { image_id: images.length + 1, image_url: "" }]);
  };

  const handleImageUpload = async (index, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "veeyokaq");
    formData.append("cloud_name", "ds4unopik");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ds4unopik/image/upload",
        formData
      );
      const updatedImages = [...images];
      updatedImages[index].image_url = response.data.secure_url;
      setImages(updatedImages);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get("authToken");
    const carpayload = {
      car_name: carName,
      tags: tags,
      description: description,
      car_type: carType,
      car_company: carCompany,
      dealer: dealer,
      images: images
        .map((img) => ({ image_url: img.image_url }))
        .filter((img) => img.image_url),
    };

    try {
      if (mode === "update") {
        console.log(carpayload);
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/update/car/${carData.car_id}`,
          carpayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        console.log("Car updated successfully");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/add/car`,
          carpayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        console.log("Car added successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Failed to submit car data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl mb-4">
            {mode === "update" ? "Update Car" : "Add Car"}
          </h2>
          <input
            type="text"
            placeholder="Car Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Car Type"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          />
          <input
            type="text"
            placeholder="Car Company"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={carCompany}
            onChange={(e) => setCarCompany(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dealer"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={dealer}
            onChange={(e) => setDealer(e.target.value)}
          />
          <div className="mb-4">
            {images.map((img, index) => (
              <div key={img.image_id} className="flex space-x-2 mb-2">
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                  className="w-full"
                />
                {img.image_url && (
                  <img
                    src={img.image_url}
                    alt="Uploaded"
                    className="w-16 h-16 object-cover"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="text-blue-600 hover:text-blue-800"
            >
              Add More Images
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-800"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : mode === "update"
                ? "Update Car"
                : "Add Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
