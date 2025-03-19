import { NextRequest, NextResponse } from "next/server";
import { parseExcel, generateErrorFile } from "@/lib/excelUtils";
import { prisma } from "@/lib/prisma";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get("content-length");
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (contentLength && Number(contentLength) > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 413 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No files sent." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { validEntries, invalidEntries, error } = await parseExcel(buffer);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (validEntries.length > 0) {
      for (const car of validEntries) {
        await prisma.car.upsert({
          where: { vin: car.vin },
          update: { ...car },
          create: { ...car },
        });
      }
    }

    if (invalidEntries.length > 0) {
      const errorBuffer = await generateErrorFile(invalidEntries);

      return new NextResponse(Readable.from(errorBuffer), {
        headers: {
          "Content-Disposition": 'attachment; filename="car-inventory-errors.xlsx"',
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }

    return NextResponse.json({ message: "File processed successfully!" });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
