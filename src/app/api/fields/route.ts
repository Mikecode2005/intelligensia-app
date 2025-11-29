import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fields = [
      { id: "computer-science", name: "Computer Science" },
      { id: "engineering", name: "Engineering" },
      { id: "medicine", name: "Medicine & Health Sciences" },
      { id: "business", name: "Business & Economics" },
      { id: "arts", name: "Arts & Humanities" },
      { id: "social-sciences", name: "Social Sciences" },
      { id: "natural-sciences", name: "Natural Sciences" },
      { id: "mathematics", name: "Mathematics" },
      { id: "education", name: "Education" },
      { id: "law", name: "Law" },
    ];

    return NextResponse.json({ fields });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch fields" },
      { status: 500 }
    );
  }
}