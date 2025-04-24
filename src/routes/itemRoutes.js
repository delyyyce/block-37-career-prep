const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/auth');

router.get('/', itemController.getAllItems);
router.get('/:itemId', itemController.getItem);

router.get('/:itemId/reviews', itemController.getReviewsForItem);
router.get('/:itemId/reviews/:reviewId', itemController.getReviewForItem);

router.post('/:itemId/reviews', auth, itemController.createReviewForItem);

router.get('/reviews/me', auth, itemController.getMyReviews);
router.put('/users/:userId/reviews/:reviewId', auth, itemController.updateReview);
router.delete('/users/:userId/reviews/:reviewId', auth, itemController.deleteReview);

router.post('/:itemId/reviews/:reviewId/comments', auth, itemController.createCommentForReview);

router.get('/comments/me', auth, itemController.getMyComments);
router.put('/users/:userId/comments/:commentId', auth, itemController.updateComment);
router.delete('/users/:userId/comments/:commentId', auth, itemController.deleteComment);

module.exports = router;
