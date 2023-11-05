import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    room_num: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    beds: [
      {
        type: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    amenities: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
  },
  {
    strictPopulate: false,
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
