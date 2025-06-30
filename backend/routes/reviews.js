const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { userName, carName, carBrand, rating, review } = req.body;
    
    if (!userName || !carName || !carBrand) {
      return res.status(400).json({ message: 'User name, car name, and car brand are required' });
    }

    // Validate rating
    const validRating = rating ? Math.max(1, Math.min(5, parseInt(rating) || 5)) : 5;

    const newReview = new Review({
      userName,
      carName,
      carBrand,
      rating: validRating,
      review: review || ''
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, carName, carBrand, rating, review } = req.body;
    
    // Validate rating
    const validRating = rating ? Math.max(1, Math.min(5, parseInt(rating) || 5)) : 5;
    
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { userName, carName, carBrand, rating: validRating, review },
      { new: true, runValidators: true }
    );
    
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
});

module.exports = router; 