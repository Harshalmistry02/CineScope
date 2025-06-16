import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // Changed from true to false to support email reviews
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Only validate if email is provided
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5], // Rating can only be 1 to 5
  },
  comment: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Add validation to ensure either userId or email is provided
reviewSchema.pre('validate', function(next) {
  if (!this.userId && !this.email) {
    return next(new Error('Either userId or email must be provided'));
  }
  next();
});

// Add indexes for better performance
reviewSchema.index({ movieId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true, sparse: true });
reviewSchema.index({ email: 1, movieId: 1 }, { unique: true, sparse: true });

export const Review = mongoose.model("Review", reviewSchema);