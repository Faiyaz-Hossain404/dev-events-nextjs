import Event, { IEvent } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

// GET /api/events/[slug]
// Fetches a single event by its slug
export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    await connectDB();

    //await and extract slug from params
    const { slug } = await params;

    //validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 },
      );
    }

    //sanitize slug (remove any potential malicious input)
    const sanitizedSlug = slug.trim().toLowerCase();

    //query event by slug
    const event: IEvent | null = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    //handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug ${sanitizedSlug} not found` },
        { status: 404 },
      );
    }

    //return successful response with event data
    return NextResponse.json(
      { message: "Event Fetched Successfully", event },
      { status: 200 },
    );
  } catch (error) {
    //log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching event by slug:", error);
    }

    //handle specific error types
    if (error instanceof Error) {
      //handle database connection errors
      if (error.message.includes("MONGODB_URI")) {
        return NextResponse.json(
          { message: "Database Configuration Error" },
          { status: 500 },
        );
      }
      //return generic error
      return NextResponse.json(
        { message: "Failet to fetch event", error: error.message },
        { status: 500 },
      );
    }

    //handle unknown errors
    return NextResponse.json(
      { message: "An unexpected error occured" },
      { status: 500 },
    );
  }
}
