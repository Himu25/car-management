import React from "react";
import { FaPlus } from "react-icons/fa";

export default function Navbar({ openModal }) {
  return (
    <nav className="flex justify-between items-center bg-blue-600 px-6 py-4 text-white shadow-md">
      <div className="text-xl font-semibold">MyApp</div>
      <button
        onClick={openModal}
        className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-100"
      >
        <FaPlus className="mr-2" />
        Add New Car
      </button>
    </nav>
  );
}
