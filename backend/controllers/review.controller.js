import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Email validation helper function
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Create a new review - UPDATED to support email
const createReview = asyncHandler(async (req, res) => {
    const { userId, email, movieId, rating, comment } = req.body;

    // Check if either userId or email is provided
    if (!userId && !email) {
        throw new ApiError(400, "Either userId or email is required");
    }

    if (!movieId || !rating || !comment) {
        throw new ApiError(400, "movieId, rating, and comment are required");
    }

    // Validate email if provided
    if (email && !validateEmail(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    // Check for duplicate reviews
    let existingReview;
    if (userId) {
        existingReview = await Review.findOne({ userId, movieId });
    } else if (email) {
        existingReview = await Review.findOne({ email, movieId });
    }

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this movie");
    }

    // Create review object
    const reviewData = {
        movieId,
        rating,
        comment
    };

    // Add either userId or email
    if (userId) {
        reviewData.userId = userId;
    } else {
        reviewData.email = email;
    }

    const review = await Review.create(reviewData);

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review created successfully"));
});

// Get reviews for a specific movie - NO CHANGES NEEDED
const getReviewsByMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId })
        .populate("userId", "username")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// Get all reviews by a specific user - NO CHANGES NEEDED
const getReviewsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const reviews = await Review.find({ userId })
        .populate("movieId", "title")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "User reviews fetched successfully"));
});

// NEW: Get reviews by email
const getReviewsByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;

    if (!validateEmail(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    const reviews = await Review.find({ email })
        .populate("movieId", "title")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Email reviews fetched successfully"));
});

// NEW: Get all reviews (useful for the frontend)
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({})
        .populate("userId", "username")
        .populate("movieId", "title")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "All reviews fetched successfully"));
});

// Delete a review by ID - NO CHANGES NEEDED
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

// Get reviews by rating - UPDATED to support email filtering
const getReviewsByRating = asyncHandler(async (req, res) => {
    const { rating, movieId, userId, email } = req.query;

    if (!rating || ![1, 2, 3, 4, 5].includes(Number(rating))) {
        throw new ApiError(400, "Rating must be a number between 1 and 5");
    }

    // Validate email if provided
    if (email && !validateEmail(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    const query = { rating: Number(rating) };

    if (movieId) query.movieId = movieId;
    if (userId) query.userId = userId;
    if (email) query.email = email; // NEW: Support email filtering

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
    getReviewsByEmail, // NEW
    getAllReviews, // NEW
    createReview,
    deleteReview
};