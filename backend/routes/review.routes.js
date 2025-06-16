import { Router } from "express";
import {
  createReview,
  getReviewsByMovie,
  getReviewsByUser,
  getReviewsByRating,
  deleteReview,
  getAllReviews, // Add this new function
  getReviewsByEmail // Add this new function
} from "../controllers/review.controller.js";

const router = Router();

router.post("/create", createReview);
router.get("/movie/:movieId", getReviewsByMovie);
router.get("/user/:userId", getReviewsByUser);
router.get("/email/:email", getReviewsByEmail); // New route for email-based queries
router.get("/all", getAllReviews); // New route to get all reviews
router.delete("/:id", deleteReview);
router.get("/by-rating", getReviewsByRating);

export default router;