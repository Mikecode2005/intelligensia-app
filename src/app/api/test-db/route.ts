// src/app/api/test-db/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    return NextResponse.json({ 
      connected: true, 
      tables: tables,
      message: "Database connection successful" 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      connected: false, 
      error: error.message,
      message: "Database connection failed" 
    }, { status: 500 });
  }
}