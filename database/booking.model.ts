import { Document, models, Schema, Types } from "mongoose";
import Event from "./event.model";
import { model } from "mongoose";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          //RFC 5322 compliant email validation regex
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  { timestamps: true } //automatically manage createdAt and updatedAt fields
);

//pre-save hook to validate event exists before creating booking
BookingSchema.pre("save", async function () {
  const booking = this as IBooking;

  //only validate eventId if it's new or modified
  if (booking.isModified("eventId") || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select("_id");

      if (!eventExists) {
        throw new Error(`Event with ID ${booking.eventId} does not exist`);
      }
    } catch {
      const validationError = new Error(
        "Invalid event ID format or database error"
      );
      validationError.name = "ValidationError";
      throw validationError;
    }
  }
});

//index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

//compound index for common queries (event bookings by date)
BookingSchema.index({ eventId: 1, createdAt: 1 });

//index on email for user booking lookups
BookingSchema.index({ email: 1 });

const Booking = models || model<IBooking>("Booking", BookingSchema);

export default Booking;
