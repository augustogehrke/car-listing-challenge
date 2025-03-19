"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "./car";

export default function CarList() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    async function fetchCars() {
      const response = await fetch(`/api/cars?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      setCars(data.cars);
      setTotalPages(data.totalPages);
    }
    fetchCars();
  }, [page]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Car Listing</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Make</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Year</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Mileage</th>
            <th className="border p-2">Color</th>
            <th className="border p-2">VIN</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="text-center">
              <td className="border p-2">{car.make}</td>
              <td className="border p-2">{car.model}</td>
              <td className="border p-2">{car.year}</td>
              <td className="border p-2">{car.price}</td>
              <td className="border p-2">{car.mileage}</td>
              <td className="border p-2">{car.color || "N/A"}</td>
              <td className="border p-2">{car.vin}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev): number => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="p-2">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev): number => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/home")}
          className="px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Upload Inventory
        </button>
      </div>
    </div>
  );
}
