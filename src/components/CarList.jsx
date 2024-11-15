"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEdit, FaTrash, FaTimesCircle } from "react-icons/fa";
import CarForm from "./CarForm";

export default function CarList({ cars }) {
  const token = Cookies.get("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [filteredCars, setFilteredCars] = useState(cars); // State to store the filtered list of cars

  const onEdit = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const onDelete = async (car) => {
    const { car_id } = car;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/car/${car_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(`Car with ID ${car_id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete car:", error);
    }
  };

  // Function to handle the search query and filter the cars
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredCars(cars);
    } else {
      setFilteredCars(
        cars.filter((car) => {
          // Combine all values to a single string and perform a case-insensitive search
          const carDetails = [
            car.car_id,
            car.car_name,
            car.description,
            car.car_type,
            car.car_company,
            car.dealer,
          ]
            .map((value) => value && value.toString().toLowerCase()) // Convert each value to string and lower case
            .join(" "); // Join all values into a single string

          return carDetails.includes(query.toLowerCase()); // Check if the query is in the combined string
        })
      );
    }
  };

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by car name..."
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCars &&
          filteredCars.map((car) => (
            <div
              key={car.car_name}
              className="relative bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
            >
              <img
                src={
                  (car.images && car.images[0]?.image_url) ||
                  "https://via.placeholder.com/150"
                }
                alt={car.car_name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => onEdit(car)}
                  className="p-2 bg-gray-200 rounded-full text-blue-500 hover:text-blue-700 hover:bg-gray-300 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(car)}
                  className="p-2 bg-gray-200 rounded-full text-red-500 hover:text-red-700 hover:bg-gray-300 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {Object.keys(car)
                  .filter(
                    (key) =>
                      key !== "images" &&
                      key !== "card_id" &&
                      key !== "user_id" &&
                      key !== "tags"
                  )
                  .map((key) => {
                    const value = car[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center text-sm text-gray-600 space-x-2"
                      >
                        <strong className="text-gray-800 capitalize">
                          {key.replace("_", " ")}:
                        </strong>
                        <span className="text-gray-700 ml-2">{value}</span>
                      </div>
                    );
                  })}
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <strong className="text-gray-800 capitalize">
                    Car Type:
                  </strong>
                  <span className="text-gray-700 ml-2">{car.car_type}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <strong className="text-gray-800 capitalize">Dealer:</strong>
                  <span className="text-gray-700 ml-2">{car.dealer}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <CarForm
              closeModal={() => setIsModalOpen(false)}
              mode="update"
              carData={selectedCar}
            />
          </div>
        </div>
      )}
    </div>
  );
}
