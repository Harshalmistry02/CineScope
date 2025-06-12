import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new review
const createReview = asyncHandler(async (req, res) => {
    const { userId, movieId, rating, comment } = req.body;

    if (!userId || !movieId || !rating || !comment) {
        throw new ApiError(400, "All fields are required");
    }

    // Optional: Prevent duplicate reviews by same user on same movie
    const existingReview = await Review.findOne({ userId, movieId });
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this movie");
    }

    const review = await Review.create({
        userId,
        movieId,
        rating,
        comment
    });

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review created successfully"));
});

// Get reviews for a specific movie
const getReviewsByMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId })
        .populate("userId", "username")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// Get all reviews by a specific user
const getReviewsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const reviews = await Review.find({ userId })
        .populate("movieId", "title")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "User reviews fetched successfully"));
});

// Delete a review by ID
const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review deleted successfully"));
});


// Get reviews by rating (with optional movieId or userId)
const getReviewsByRating = asyncHandler(async (req, res) => {
    const { rating, movieId, userId } = req.query;

    if (!rating || ![1, 2, 3, 4, 5].includes(Number(rating))) {
        throw new ApiError(400, "Rating must be a number between 1 and 5");
    }

    const query = { rating: Number(rating) };

    if (movieId) query.movieId = movieId;
    if (userId) query.userId = userId;

    const reviews = await Review.find(query)
        .populate("userId", "username")
        .populate("movieId", "title")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Reviews filtered by rating"));
});


export {
    getReviewsByMovie,
    getReviewsByRating,
    getReviewsByUser,
    createReview,
    deleteReview
}