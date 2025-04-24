const Item = require('../models/Item');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching item' });
  }
};

exports.getReviewsForItem = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { ItemId: req.params.itemId },
      include: [{ model: User, attributes: ['id', 'username'] }],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

exports.getReviewForItem = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.reviewId, ItemId: req.params.itemId },
      include: [{ model: User, attributes: ['id', 'username'] }],
    });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching review' });
  }
};

exports.createReviewForItem = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const userId = req.user.id;
    const itemId = req.params.itemId;

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({ where: { UserId: userId, ItemId: itemId } });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this item' });
    }

    const review = await Review.create({ rating, text, UserId: userId, ItemId: itemId });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error creating review' });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.findAll({
      where: { UserId: userId },
      include: [{ model: Item, attributes: ['id', 'name'] }],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching your reviews' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params;
    const { rating, text } = req.body;

    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const review = await Review.findOne({ where: { id: reviewId, UserId: userId } });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.rating = rating !== undefined ? rating : review.rating;
    review.text = text !== undefined ? text : review.text;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error updating review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params;

    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const review = await Review.findOne({ where: { id: reviewId, UserId: userId } });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting review' });
  }
};

exports.createCommentForReview = async (req, res) => {
  try {
    const { itemId, reviewId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    // Check if review exists and belongs to the item
    const review = await Review.findOne({ where: { id: reviewId, ItemId: itemId } });
    if (!review) return res.status(404).json({ error: 'Review not found for this item' });

    const comment = await Comment.create({ text, UserId: userId, ReviewId: reviewId });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating comment' });
  }
};

exports.getMyComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const comments = await Comment.findAll({
      where: { UserId: userId },
      include: [{ model: Review, attributes: ['id', 'text'] }],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching your comments' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { userId, commentId } = req.params;
    const { text } = req.body;

    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const comment = await Comment.findOne({ where: { id: commentId, UserId: userId } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.text = text !== undefined ? text : comment.text;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { userId, commentId } = req.params;

    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const comment = await Comment.findOne({ where: { id: commentId, UserId: userId } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
};
