import { cookies } from "next/headers";
import Layout from "@/components/Layout";
const fetchCars = async () => {
  try {
    let cars = [];
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/get/car/added_by_user`,
      {
        headers: {
          Authorization: `${authToken}`,
        },
        next: {
          tags: ["cars_collection"],
        },
        cache: "no-store",
      }
    );
    if (response.ok) {
      cars = await response.json();
      console.log(cars);
    }
    console.log(cars);
    return cars;
  } catch (error) {
    console.error(error.message);
  }
};

export default async function Page() {
  const cars = await fetchCars();
  return (
    <>
      <Layout cars={cars.cars} />
    </>
  );
}
