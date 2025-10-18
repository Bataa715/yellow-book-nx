import { Router } from 'express';
import {
  getYellowBooks,
  getYellowBookById,
  createYellowBook,
  updateYellowBook,
  deleteYellowBook,
} from '../controllers/yellow-books.controller';
import { createReview, getReviewsByBusinessId } from '../controllers/reviews.controller';
import {
  getCategories as getCategoriesController,
  getPrimaryCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller';

const router = Router();

router.get('/yellow-books', getYellowBooks);
router.post('/yellow-books', createYellowBook);
router.get('/yellow-books/:id', getYellowBookById);
router.put('/yellow-books/:id', updateYellowBook);
router.delete('/yellow-books/:id', deleteYellowBook);
router.get('/categories', getCategoriesController);
router.get('/categories/primary', getPrimaryCategories);
router.post('/categories', createCategory);
router.get('/categories/:id', getCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Review routes
router.post('/reviews', createReview);
router.get('/reviews/:businessId', getReviewsByBusinessId);

export default router;
