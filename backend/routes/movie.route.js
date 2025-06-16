import { Router } from "express";

import {
    createMovie,
    getMovieByTitle,
    getMovieById,
    updateMovie,
    deleteMovie,
    getMoviesByGenre,
    getMoviesByLanguage,
    getAllMovies
} from '../controllers/movie.controller.js'
import { upload } from '../middleware/multer.middlerware.js'
const router = Router()

router.post("/createMovie", upload.single("poster"), createMovie);
router.get('/getMovieByTitle/:title', getMovieByTitle);
router.get("/getMovieById/:id", getMovieById);  
router.put("/updateMovie/:id", upload.single("poster"), updateMovie); 
router.delete("/deleteMovie/:id", deleteMovie);
router.post("/getByGenre/", getMoviesByGenre);
router.post('/getByLanguage', getMoviesByLanguage); 
router.get('/all', getAllMovies);


export default router