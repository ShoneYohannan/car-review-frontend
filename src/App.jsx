import { useState, useEffect } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api';

const TOP_BRANDS = ['Toyota', 'BMW', 'Mercedes-Benz', 'Tesla', 'Hyundai'];
const POPULAR_BRANDS = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen',
  'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Subaru', 'Lexus', 'Jeep', 'Tesla', 'Porsche',
  'Jaguar', 'Land Rover', 'Volvo', 'Renault', 'Peugeot', 'Fiat', 'Skoda', 'Suzuki',
  'Mitsubishi', 'Mini', 'Dodge', 'Ram', 'Genesis', 'BYD', 'MG', 'Tata', 'Mahindra', 'Citroën'
];

const BRAND_ICONS = {
  'Toyota': '🚗',
  'BMW': '🚙',
  'Mercedes-Benz': '🚘',
  'Tesla': '⚡',
  'Hyundai': '🚐',
  'Honda': '🚕',
  'Ford': '🚚',
  'Chevrolet': '🚙',
  'Audi': '🚗',
  'Volkswagen': '🚙',
  'Kia': '🚗',
  'Nissan': '🚙',
  'Mazda': '🚗',
  'Subaru': '🚙',
  'Lexus': '🚘',
  'Jeep': '🚙',
  'Porsche': '🏎️',
  'Jaguar': '🐆',
  'Land Rover': '🚙',
  'Volvo': '🚗',
  'Renault': '🚗',
  'Peugeot': '🚗',
  'Fiat': '🚗',
  'Skoda': '🚗',
  'Suzuki': '🚗',
  'Mitsubishi': '🚗',
  'Mini': '🚗',
  'Dodge': '🚙',
  'Ram': '🚚',
  'Genesis': '🚗',
  'BYD': '🔋',
  'MG': '🚗',
  'Tata': '🚗',
  'Mahindra': '🚙',
  'Citroën': '🚗',
};

function getBrandIcon(brand) {
  return BRAND_ICONS[brand] || '🚗';
}

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

function groupReviewsByBrand(reviews) {
  const grouped = {};
  reviews.forEach((review) => {
    const brand = review.carBrand.trim();
    if (!grouped[brand]) grouped[brand] = [];
    grouped[brand].push(review);
  });
  return grouped;
}

function App() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    userName: '',
    carName: '',
    carBrand: '',
    rating: 5,
    review: ''
  })
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);

  // Collect unique car brands from reviews and merge with popular brands
  const allBrands = [
    ...TOP_BRANDS,
    ...POPULAR_BRANDS,
    ...reviews.map(r => r.carBrand.trim()).filter(Boolean)
  ];
  const uniqueBrands = Array.from(new Set(allBrands)).filter(Boolean);
  const [customBrand, setCustomBrand] = useState('');
  const [useCustomBrand, setUseCustomBrand] = useState(false);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/reviews`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load reviews on component mount
  useEffect(() => {
    fetchReviews()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleBrandChange = (e) => {
    const value = e.target.value;
    if (value === '__custom__') {
      setUseCustomBrand(true);
      setFormData(prev => ({ ...prev, carBrand: '' }));
    } else {
      setUseCustomBrand(false);
      setFormData(prev => ({ ...prev, carBrand: value }));
    }
  };

  const handleCustomBrandChange = (e) => {
    setCustomBrand(e.target.value);
    setFormData(prev => ({ ...prev, carBrand: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.userName && formData.carName && formData.carBrand) {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          throw new Error('Failed to create review')
        }

        const newReview = await response.json()
        setReviews(prev => [newReview, ...prev])
        setFormData({
          userName: '',
          carName: '',
          carBrand: '',
          rating: 5,
          review: ''
        })
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const deleteReview = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete review')
      }

      setReviews(prev => prev.filter(review => review._id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Group reviews by car brand
  const reviewsByBrand = groupReviewsByBrand(reviews);
  const brandNames = Object.keys(reviewsByBrand).sort();

  // Filter brands and reviews by search and rating
  const filteredBrandNames = brandNames.filter(brand =>
    brand.toLowerCase().includes(search.toLowerCase())
  );
  const filteredReviewsByBrand = {};
  filteredBrandNames.forEach(brand => {
    filteredReviewsByBrand[brand] = reviewsByBrand[brand].filter(
      review =>
        (review.carName.toLowerCase().includes(search.toLowerCase()) ||
         review.carBrand.toLowerCase().includes(search.toLowerCase())) &&
        (ratingFilter === 0 || review.rating >= ratingFilter)
    );
  });

  return (
    <div className="app">
      <header className="header">
        <h1 className="site-title">
          <span className="title-main">CARS <span className="mui-blue">24</span></span>
        </h1>
        <p className="subtitle">Find, rate, and share your car experiences with the world!</p>
      </header>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <main className="main">
        <section className="form-section">
          <h2>Add Your Review</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="userName">Your Name:</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="carName">Car Name:</label>
              <input
                type="text"
                id="carName"
                name="carName"
                value={formData.carName}
                onChange={handleInputChange}
                placeholder="e.g., Civic, Camry, Model 3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="carBrand">Car Brand:</label>
              <select
                id="carBrand"
                name="carBrand"
                value={useCustomBrand ? '__custom__' : formData.carBrand}
                onChange={handleBrandChange}
                required={!useCustomBrand}
              >
                <option value="" disabled>Select a brand</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
                <option value="__custom__">Other (enter manually)</option>
              </select>
              {useCustomBrand && (
                <input
                  type="text"
                  id="customBrand"
                  name="customBrand"
                  value={customBrand}
                  onChange={handleCustomBrandChange}
                  placeholder="Enter car brand"
                  required
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Rating:</label>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={handleRatingChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="review">Review:</label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                placeholder="Share your experience with this car..."
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Review
            </button>
          </form>
        </section>

        <section className="reviews-section">
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by brand or car name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="rating-filter-container">
            <span className="filter-label">Filter by rating:</span>
            <div className="rating-filter-stars">
              {[5, 4, 3, 2, 1].map(star => (
                <span
                  key={star}
                  className={`star-filter ${ratingFilter === star ? 'selected' : ''}`}
                  onClick={() => setRatingFilter(star)}
                  title={`Show reviews with ${star} stars or more`}
                >
                  ★
                </span>
              ))}
              <button
                className="clear-rating-filter"
                onClick={() => setRatingFilter(0)}
                title="Clear rating filter"
                style={{ marginLeft: 8 }}
              >
                Clear
              </button>
            </div>
          </div>
          <h2>Recent Reviews ({reviews.length})</h2>
          {loading ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to share!</p>
          ) : (
            <div className="reviews-by-brand">
              {filteredBrandNames.length === 0 ? (
                <p className="no-reviews">No matching brands or reviews found.</p>
              ) : (
                filteredBrandNames.map((brand) => (
                  <div key={brand} className="brand-section">
                    <h3 className="brand-title">{brand}</h3>
                    <div className="reviews-grid">
                      {filteredReviewsByBrand[brand].map((review) => (
                        <div key={review._id} className="review-card">
                          <div className="review-header">
                            <div className="brand-row">
                              <span className="brand-icon">{getBrandIcon(review.carBrand)}</span>
                              <span className="brand">{review.carBrand}</span>
                            </div>
                            <h3>{review.carName}</h3>
                          </div>
                          <div className="review-rating">
                            <StarRating rating={review.rating} readonly={true} />
                            <span className="rating-text">{review.rating}/5</span>
                          </div>
                          <p className="reviewer">By: {review.userName}</p>
                          {review.review && (
                            <p className="review-text">{review.review}</p>
                          )}
                          <div className="review-footer">
                            <span className="date">{formatDate(review.date)}</span>
                            <button 
                              onClick={() => deleteReview(review._id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
