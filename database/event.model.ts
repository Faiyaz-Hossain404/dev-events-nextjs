import { Schema, Model, Document, Types } from "mongoose";

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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-l]/g, "") //removes special characters
    .replace(/\s+/g, "-") //replace spaces with hephens
    .replace(/-+/g, "-") //replace multiple hyphens with sigle hyphen
    .replace(/^-+|-+$/g, ""); //remove leading/trailing hyphens
}

//pre-save hook for slug generation and data normalization
EventSchema.pre("save", function (next) {
  const event = this as IEvent;

  //generate slug from title changed or document is new
  if (event.isModified("title") || event.isNew) {
    event.slug = generateSlug(event.title);
  }
});
