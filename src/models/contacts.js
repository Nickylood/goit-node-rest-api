import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Contacts = mongoose.model('Contacts', contactSchema);

export default Contacts;
