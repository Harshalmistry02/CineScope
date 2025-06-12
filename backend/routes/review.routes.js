import { Router } from "express";
import {
  createReview,
  getReviewsByMovie,
  getReviewsByUser,
  getReviewsByRating,
  deleteReview
} from "../controllers/review.controller.js";

const router = Router();

router.post("/create", createReview);
router.get("/movie/:movieId", getReviewsByMovie);
router.get("/user/:userId", getReviewsByUser);
router.delete("/:id", deleteReview);
router.get("/by-rating", getReviewsByRating); 

export default router;
