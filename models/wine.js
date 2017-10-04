'use strict';

const mongoose = require('mongoose');

const WineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      validate: {
        validator: (y) => (y > 1500 && y < (new Date()).getFullYear() + 50),
        message: '{VALUE} is not a valid year',
      },
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['red', 'white', 'rose'],
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

WineSchema.set('toObject', {getters: true});

module.exports = mongoose.model('Wine', WineSchema);
