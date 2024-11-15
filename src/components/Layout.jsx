"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import CarForm from "./CarForm";
import CarList from "./CarList";

export default function Layout({ cars }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar openModal={openModal} />

      <CarList cars={cars} />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <CarForm mode={"add"} closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
