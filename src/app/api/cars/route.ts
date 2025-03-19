import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page: number = Number(searchParams.get("page")) || 1;
    const pageSize: number = Number(searchParams.get("pageSize")) || 5;

    const totalCars: number = await prisma.car.count();
    const totalPages: number = Math.ceil(totalCars / pageSize);

    const cars = await prisma.car.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ cars, totalPages });
  } catch (error) {
    console.error("Error getting cars:", error);
    return NextResponse.json({ error: "Error getting cars" }, { status: 500 });
  }
}
