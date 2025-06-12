import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    genre: {
        type: String,
        required: true,
        enum: ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Family', 'History', 'Romance', 'Sci-Fi', 'Sport', 'other']
    },
    duration: {
        type: Number, // in minutes
        required: true,
        min: 1
    },
    poster: {
        type: String, // cloudinary url
        required: true,// cloudinary url
    },
    language: {
        type: String,
        required: true,
        default: 'English'
    },
    availability: {
        type:String
    },


})

export const Movie = mongoose.model("Movie", movieSchema)