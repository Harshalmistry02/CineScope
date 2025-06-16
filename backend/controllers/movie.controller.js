import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Movie } from "../models/movie.model.js";

const createMovie = asyncHandler(async (req, res) => {
    const { title, description, genre, duration, language, availability } = req.body;

    // Basic validation
    if (
        [title, description, genre, duration, language, availability].some(
            (field) => !field || field.toString().trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingMovie = await Movie.findOne({ title: title.trim() });

    if (existingMovie) {
        throw new ApiError(409, "Movie already exists");
    }


    // Poster upload
    const posterLocalPath = req.file?.path;
    if (!posterLocalPath) {
        throw new ApiError(400, "Poster is required");
    }

    const poster = await uploadOnCloudinary(posterLocalPath);

    if (!poster?.url) {
        throw new ApiError(400, "Failed to upload poster to Cloudinary");
    }

    // Create movie
    const movie = await Movie.create({
        title: title.trim(),
        description: description.trim(),
        genre: genre.trim(),
        duration: Number(duration),
        poster: poster.url,
        language: language.trim(),
        availability: availability.trim(),
    });

    return res
        .status(201)
        .json(new ApiResponse(201, movie, "Movie registered successfully"));
});

const getMovieByTitle = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title || title.toString().trim() === "") {
        throw new ApiError(400, "Movie title is required");
    }

    const movie = await Movie.findOne({
        title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
    });

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, movie, "Movie retrieved successfully"));
});

const getMovieById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    const movie = await Movie.findById(id);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, movie, "Movie retrieved successfully"));
});

const getAllMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find().sort({ createdAt: -1 }); // Most recent first

    if (movies.length === 0) {
        throw new ApiError(404, "No movies found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, movies, "All movies retrieved successfully"));
});

// Update movie
const updateMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, genre, duration, language, availability } = req.body;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    const movie = await Movie.findById(id);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    // Optional: Validate all fields if needed
    if (
        [title, description, genre, duration, language, availability].some(
            (field) => field !== undefined && field.toString().trim() === ""
        )
    ) {
        throw new ApiError(400, "Fields cannot be empty if provided");
    }

    // Check if title is being updated and it's unique
    if (title && title.trim() !== movie.title) {
        const existingMovie = await Movie.findOne({ title: title.trim() });
        if (existingMovie) {
            throw new ApiError(409, "Movie with this title already exists");
        }
    }

    // Keep old poster unless updated
    let posterUrl = movie.poster;

    if (req.file?.path) {
        const newPoster = await uploadOnCloudinary(req.file.path);
        if (!newPoster?.url) {
            throw new ApiError(400, "Failed to upload new poster");
        }
        posterUrl = newPoster.url;
    }

    // Update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        {
            ...(title && { title: title.trim() }),
            ...(description && { description: description.trim() }),
            ...(genre && { genre: genre.trim() }), // match createMovie
            ...(duration && { duration: Number(duration) }),
            ...(language && { language: language.trim() }),
            ...(availability !== undefined && { availability: availability.trim() }),
            poster: posterUrl
        },
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedMovie, "Movie updated successfully"));
});

// Delete movie
const deleteMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Movie deleted successfully"));
});

// Get movies by genre
const getMoviesByGenre = asyncHandler(async (req, res) => {
    const { genre } = req.body; // or req.query if sending via URL query

    if (!genre) {
        throw new ApiError(400, "Genre is required");
    }

    const movies = await Movie.find({ genre: genre }).sort({ createdAt: -1 });

    if (movies.length === 0) {
        throw new ApiError(404, `No movies found in the '${genre}' genre`);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, movies, `Movies in '${genre}' genre retrieved successfully`));
});

// Get by language
const getMoviesByLanguage = asyncHandler(async (req, res) => {
    const { language } = req.body; // Or use req.query if preferred

    if (!language) {
        throw new ApiError(400, "Language is required");
    }

    const movies = await Movie.find({ language: language }).sort({ createdAt: -1 });

    if (movies.length === 0) {
        throw new ApiError(404, `No movies found in the '${language}' language`);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, movies, `Movies in '${language}' retrieved successfully`));
});




export {
    createMovie,
    getMovieByTitle,
    getMovieById,
    updateMovie,
    deleteMovie,
    getMoviesByGenre,
    getAllMovies,
    getMoviesByLanguage
};
