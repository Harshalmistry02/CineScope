Here are the essential controller function names organized by category:
Core CRUD Operations:

createMovie - Create a new movie entry
getAllMovies - Retrieve all movies with pagination
getMovieById - Get specific movie by ID
updateMovie - Update existing movie data
deleteMovie - Remove a movie

Search & Filter Controllers:

getMoviesByGenre - Filter by genre (Action, Comedy, etc.)
getMoviesByLanguage - Filter by language
searchMoviesByTitle - Search with partial title matching
getMoviesByDuration - Filter by duration range
getMoviesByAvailability - Filter by availability status

Advanced Query Controllers:

getMoviesByCast - Search by cast members
getMoviesWithFilters - Combined filtering (genre + language + duration)
getRecentMovies - Recently added movies
getPopularMovies - Sorted by popularity criteria

Utility Controllers:

getMovieGenres - List all available genres
getMovieLanguages - List all languages in database
getMovieStats - Statistics (count by genre, average duration)
bulkCreateMovies - Batch movie creation
validateMovieData - Data validation helper

These controller names align with your schema fields and provide comprehensive movie management functionality. You can implement them based on your specific business requirements and API endpoints.     


import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Movie } from "../models/movie.models.js";

// Create a new movie
const createMovie = asyncHandler(async (req, res) => {
    const { title, genre, duration, language, availability, cast } = req.body;

    // Basic validation
    if (
        [title, genre, duration, language, cast].some(
            (field) => !field || field.toString().trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be provided");
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
        genre: genre.trim(),
        duration: Number(duration),
        poster: poster.url,
        language: language.trim(),
        availability: availability?.trim() || "",
        cast: cast.trim(),
    });

    return res
        .status(201)
        .json(new ApiResponse(201, movie, "Movie created successfully"));
});

// Get all movies with pagination
const getAllMovies = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const movies = await Movie.find({})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    const response = {
        movies,
        currentPage: Number(page),
        totalPages,
        totalMovies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, "Movies retrieved successfully"));
});

// Get movie by ID
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

// Update movie
const updateMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, genre, duration, language, availability, cast } = req.body;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    const movie = await Movie.findById(id);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    // Check if title is being updated and if it already exists
    if (title && title.trim() !== movie.title) {
        const existingMovie = await Movie.findOne({ title: title.trim() });
        if (existingMovie) {
            throw new ApiError(409, "Movie with this title already exists");
        }
    }

    let posterUrl = movie.poster;

    // Handle poster update if new file is uploaded
    if (req.file?.path) {
        const newPoster = await uploadOnCloudinary(req.file.path);
        if (!newPoster?.url) {
            throw new ApiError(400, "Failed to upload new poster");
        }
        posterUrl = newPoster.url;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        {
            ...(title && { title: title.trim() }),
            ...(genre && { genre: genre.trim() }),
            ...(duration && { duration: Number(duration) }),
            ...(language && { language: language.trim() }),
            ...(availability !== undefined && { availability: availability.trim() }),
            ...(cast && { cast: cast.trim() }),
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
    const { genre } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!genre) {
        throw new ApiError(400, "Genre is required");
    }

    const movies = await Movie.find({ genre: genre })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const totalMovies = await Movie.countDocuments({ genre: genre });

    const response = {
        movies,
        genre,
        totalMovies,
        currentPage: Number(page),
        totalPages: Math.ceil(totalMovies / limit)
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, `Movies in ${genre} genre retrieved successfully`));
});

// Get movies by language
const getMoviesByLanguage = asyncHandler(async (req, res) => {
    const { language } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!language) {
        throw new ApiError(400, "Language is required");
    }

    const movies = await Movie.find({ language: language })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const totalMovies = await Movie.countDocuments({ language: language });

    const response = {
        movies,
        language,
        totalMovies,
        currentPage: Number(page)
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, `Movies in ${language} retrieved successfully`));
});

// Search movies by title
const searchMoviesByTitle = asyncHandler(async (req, res) => {
    const { title } = req.query;
    const { page = 1, limit = 10 } = req.query;

    if (!title) {
        throw new ApiError(400, "Search title is required");
    }

    const movies = await Movie.find({
        title: { $regex: title, $options: 'i' }
    })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const totalMovies = await Movie.countDocuments({
        title: { $regex: title, $options: 'i' }
    });

    const response = {
        movies,
        searchTerm: title,
        totalMovies,
        currentPage: Number(page)
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, "Movies found successfully"));
});

// Get movies by duration range
const getMoviesByDuration = asyncHandler(async (req, res) => {
    const { minDuration, maxDuration } = req.query;
    const { page = 1, limit = 10 } = req.query;

    let durationFilter = {};

    if (minDuration) {
        durationFilter.$gte = Number(minDuration);
    }
    if (maxDuration) {
        durationFilter.$lte = Number(maxDuration);
    }

    if (Object.keys(durationFilter).length === 0) {
        throw new ApiError(400, "At least one duration parameter (minDuration or maxDuration) is required");
    }

    const movies = await Movie.find({ duration: durationFilter })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ duration: 1 });

    const totalMovies = await Movie.countDocuments({ duration: durationFilter });

    const response = {
        movies,
        durationRange: { minDuration, maxDuration },
        totalMovies,
        currentPage: Number(page)
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, "Movies by duration retrieved successfully"));
});

// Get movies by availability
const getMoviesByAvailability = asyncHandler(async (req, res) => {
    const { availability } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!availability) {
        throw new ApiError(400, "Availability status is required");
    }

    const movies = await Movie.find({ availability: availability })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const totalMovies = await Movie.countDocuments({ availability: availability });

    const response = {
        movies,
        availability,
        totalMovies,
        currentPage: Number(page)
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, `Movies with ${availability} availability retrieved successfully`));
});

// Get movies by cast
const getMoviesByCast = asyncHandler(async (req, res) => {
    const { cast } = req.query;
    const { page = 1, limit = 10 } = req.query;

    if (!cast) {
        throw new ApiError(400, "Cast member name is required");
    }

    const movies = await Movie.find({
        cast: { $regex: cast, $options: 'i' }
    })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const totalMovies = await Movie.countDocuments({
        cast: { $regex: cast, $options: 'i' }
    });

    const response = {
        movies,
        castMember: cast,
        totalMovies,
        currentPage: Number(page)
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, `Movies with ${cast} retrieved successfully`));
});

// Get movies with multiple filters
const getMoviesWithFilters = asyncHandler(async (req, res) => {
    const { genre, language, availability, minDuration, maxDuration } = req.query;
    const { page = 1, limit = 10 } = req.query;

    let filter = {};

    if (genre) filter.genre = genre;
    if (language) filter.language = language;
    if (availability) filter.availability = availability;

    if (minDuration || maxDuration) {
        filter.duration = {};
        if (minDuration) filter.duration.$gte = Number(minDuration);
        if (maxDuration) filter.duration.$lte = Number(maxDuration);
    }

    const movies = await Movie.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const totalMovies = await Movie.countDocuments(filter);

    const response = {
        movies,
        appliedFilters: { genre, language, availability, minDuration, maxDuration },
        totalMovies,
        currentPage: Number(page)
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, "Filtered movies retrieved successfully"));
});

// Get recent movies
const getRecentMovies = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const movies = await Movie.find({})
        .sort({ createdAt: -1 })
        .limit(Number(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, movies, "Recent movies retrieved successfully"));
});

// Get movie genres
const getMovieGenres = asyncHandler(async (req, res) => {
    const genres = await Movie.distinct('genre');

    return res
        .status(200)
        .json(new ApiResponse(200, genres, "Movie genres retrieved successfully"));
});

// Get movie languages
const getMovieLanguages = asyncHandler(async (req, res) => {
    const languages = await Movie.distinct('language');

    return res
        .status(200)
        .json(new ApiResponse(200, languages, "Movie languages retrieved successfully"));
});

// Get movie statistics
const getMovieStats = asyncHandler(async (req, res) => {
    const totalMovies = await Movie.countDocuments();
    
    const genreStats = await Movie.aggregate([
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const languageStats = await Movie.aggregate([
        { $group: { _id: '$language', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const avgDuration = await Movie.aggregate([
        { $group: { _id: null, averageDuration: { $avg: '$duration' } } }
    ]);

    const stats = {
        totalMovies,
        genreDistribution: genreStats,
        languageDistribution: languageStats,
        averageDuration: avgDuration[0]?.averageDuration || 0
    };

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Movie statistics retrieved successfully"));
});

// Bulk create movies
const bulkCreateMovies = asyncHandler(async (req, res) => {
    const { movies } = req.body;

    if (!movies || !Array.isArray(movies) || movies.length === 0) {
        throw new ApiError(400, "Movies array is required");
    }

    // Validate each movie
    for (let movie of movies) {
        if (!movie.title || !movie.genre || !movie.duration || !movie.poster || !movie.cast) {
            throw new ApiError(400, "All required fields must be provided for each movie");
        }
    }

    const createdMovies = await Movie.insertMany(movies);

    return res
        .status(201)
        .json(new ApiResponse(201, createdMovies, `${createdMovies.length} movies created successfully`));
});

export {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    getMoviesByGenre,
    getMoviesByLanguage,
    searchMoviesByTitle,
    getMoviesByDuration,
    getMoviesByAvailability,
    getMoviesByCast,
    getMoviesWithFilters,
    getRecentMovies,
    getMovieGenres,
    getMovieLanguages,
    getMovieStats,
    bulkCreateMovies
};  