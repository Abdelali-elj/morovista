import React, { useState } from 'react';
import { LuStar, LuStarHalf, LuStarOutline } from 'react-icons/lu';
import './Testimonials.css';
import { useTranslation } from 'react-i18next';

// Sample mock data (replace with API call later)
const mockTestimonials = [
  {
    id: 1,
    type: 'hotel',
    avatar: 'https://via.placeholder.com/200',
    comment: 'The boutique hotel was a hidden gem, exceptional service and breathtaking views.',
    name: 'Amina Z.',
    location: 'Marrakech, Morocco',
    rating: 4.5,
  },
  {
    id: 2,
    type: 'restaurant',
    avatar: 'https://via.placeholder.com/200',
    comment: 'The rooftop restaurant offered a culinary journey unlike any other.',
    name: 'Karim B.',
    location: 'Fez, Morocco',
    rating: 5,
  },
  {
    id: 3,
    type: 'hotel',
    avatar: 'https://via.placeholder.com/200',
    comment: 'Luxury and comfort combined; the spa was pure bliss.',
    name: 'Leila H.',
    location: 'Essaouira, Morocco',
    rating: 4,
  },
  {
    id: 4,
    type: 'restaurant',
    avatar: 'https://via.placeholder.com/200',
    comment: 'A feast for the senses – the flavors were authentic and vibrant.',
    name: 'Youssef M.',
    location: 'Rabat, Morocco',
    rating: 4.5,
  },
];

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) {
    stars.push(<LuStar key={`star-${i}`} className="star filled" />);
  }
  if (half) stars.push(<LuStarHalf key="star-half" className="star filled" />);
  while (stars.length < 5) {
    stars.push(<LuStarOutline key={`empty-${stars.length}`} className="star" />);
  }
  return <div className="stars">{stars}</div>;
};

const Testimonials = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all'); // all | hotel | restaurant

  const filtered = mockTestimonials.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>{t('testimonials.title') || 'What Our Travelers Say'}</h2>
        <div className="filter-toggle">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            {t('testimonials.all') || 'All'}
          </button>
          <button className={filter === 'hotel' ? 'active' : ''} onClick={() => setFilter('hotel')}>
            {t('testimonials.hotels') || 'Hotels'}
          </button>
          <button className={filter === 'restaurant' ? 'active' : ''} onClick={() => setFilter('restaurant')}>
            {t('testimonials.restaurants') || 'Restaurants'}
          </button>
        </div>
      </div>
      <div className="testimonials-grid">
        {filtered.map((item) => (
          <div className="testimonial-card" key={item.id}>
            <div className="testimonial-avatar">
              <img src={item.avatar} alt={item.name} loading="lazy" />
            </div>
            <p className="testimonial-comment">{item.comment}</p>
            <h4 className="testimonial-name">{item.name}</h4>
            <p className="testimonial-location">{item.location}</p>
            {renderStars(item.rating)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
