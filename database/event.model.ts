import { model } from "mongoose";
import { Schema, Document, models } from "mongoose";

//typescript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title can not exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description can not exceed 1000 characters"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      maxlength: [500, "Overview can not exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be either online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Agenda must have at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "At least one tag is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "There must be at least one tag",
      },
    },
  },
  { timestamps: true } //auto-generate createdAt and updatedAt fields
);

//helper func to generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-l]/g, "") //removes special characters
    .replace(/\s+/g, "-") //replace spaces with hephens
    .replace(/-+/g, "-") //replace multiple hyphens with sigle hyphen
    .replace(/^-+|-+$/g, ""); //remove leading/trailing hyphens
}

//helper func to normalize date to ISO format
function normalizeDate(dateSring: string): string {
  const date = new Date(dateSring);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date.toISOString().split("T")[0]; //return yyyy-mm-dd format
}

//helper func to normalize time format
function normalizeTime(timeString: string): string {
  //handle various time formats like "2:30 PM", "14:30", etc.
  const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
  const match = timeString.match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format. Use HH:MM AM/PM");
  }

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[4].toUpperCase();

  if (period) {
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  if (
    hours < 0 ||
    hours > 23 ||
    parseInt(minutes) < 0 ||
    parseInt(minutes) > 59
  ) {
    throw new Error("Invalid time value");
  }
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

//pre-save hook for slug generation and data normalization
EventSchema.pre("save", async function () {
  const event = this as IEvent;

  //generate slug from title changed or document is new
  if (event.isModified("title") || event.isNew) {
    event.slug = generateSlug(event.title);
  }

  //nomalize date to ISO format if it's not already
  if (event.isModified("date")) {
    event.date = normalizeDate(event.date);
  }

  //normalize time format (HH:MM)
  if (event.isModified("time")) {
    event.time = normalizeTime(event.time);
  }
});

EventSchema.index({ slug: 1 }, { unique: true });

EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
