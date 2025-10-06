// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Loading screen for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Hero slider images
  const heroSlides = [
    {
      image: '/assets/hero-1.jpg',
      title: 'Welcome to Sardar Estate',
      subtitle: 'Discover the perfect property that matches your lifestyle and budget',
      buttonText: 'Explore Properties'
    },
    {
      image: '/assets/hero-4.jpg',
      title: 'Luxury Apartments',
      subtitle: 'Experience premium living in the heart of the city',
      buttonText: 'View Luxury Collection'
    },
    {
      image: '/assets/hero-3.jpg',
      title: 'Commercial Properties',
      subtitle: 'Prime locations for your business expansion',
      buttonText: 'Commercial Spaces'
    }
  ];

  // Featured properties
  const featuredProperties = [
    {
      id: 1,
      image: '/assets/hero-1.jpg',
      title: 'Luxury Villa in Gulshan',
      price: '$450,000',
      location: 'Gulshan, Dhaka',
      beds: 4,
      baths: 3,
      sqft: '3,200',
      type: 'Villa'
    },
    {
      id: 2,
      image: '/assets/hero-4.jpg',
      title: 'Modern Apartment in Banani',
      price: '$220,000',
      location: 'Banani, Dhaka',
      beds: 3,
      baths: 2,
      sqft: '1,800',
      type: 'Apartment'
    },
    {
      id: 3,
      image: '/assets/hero-3.jpg',
      title: 'Commercial Space in Dhanmondi',
      price: '$350,000',
      location: 'Dhanmondi, Dhaka',
      beds: 'Office',
      baths: '2',
      sqft: '2,500',
      type: 'Commercial'
    },
    {
      id: 4,
      image: '/assets/hero-2.jpg',
      title: 'Family Home in Uttara',
      price: '$280,000',
      location: 'Uttara, Dhaka',
      beds: 5,
      baths: 4,
      sqft: '2,800',
      type: 'House'
    }
  ];

  // Services
  const services = [
    {
      icon: '🏠',
      title: 'Residential Sales',
      description: 'Find your perfect home from our extensive collection of residential properties.'
    },
    {
      icon: '🏢',
      title: 'Commercial Leasing',
      description: 'Premium commercial spaces for offices, retail, and business establishments.'
    },
    {
      icon: '💰',
      title: 'Property Investment',
      description: 'Smart investment opportunities with high returns in prime locations.'
    },
    {
      icon: '⚖️',
      title: 'Legal Support',
      description: 'Complete legal assistance and documentation for property transactions.'
    }
  ];

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-primary">
        <div className="text-center">
          <img 
            src="/assets/logo1.png" 
            alt="Loading..." 
            className="spin"
            style={{ width: '200px', height: 'auto' }}
          />
          <style>
            {`
              .spin {
                animation: spin 2s linear infinite;
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bootstrap Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
      />
      
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section position-relative" style={{ height: '100vh', marginTop: '76px' }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`position-absolute w-100 h-100 transition-all ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <div className="container h-100 d-flex align-items-center">
              <div className="text-center text-white w-100">
                <h1 className="display-3 fw-bold mb-4 text-shadow">{slide.title}</h1>
                <p className="fs-5 mb-5 opacity-90 text-shadow">{slide.subtitle}</p>
                <Link to="/properties" className="btn btn-primary btn-lg px-5 py-3 fw-semibold">
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button 
          className="position-absolute top-50 start-0 translate-middle-y btn btn-light btn-lg rounded-circle opacity-75 mx-3"
          onClick={prevSlide}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <button 
          className="position-absolute top-50 end-0 translate-middle-y btn btn-light btn-lg rounded-circle opacity-75 mx-3"
          onClick={nextSlide}
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Slider Indicators */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="d-flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm rounded-circle ${index === currentSlide ? 'btn-light' : 'btn-outline-light'}`}
                style={{ width: '12px', height: '12px' }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card shadow-lg border-0 rounded-3">
                <div className="card-body p-5">
                  <h2 className="text-center display-5 fw-bold text-dark mb-4">
                    Find Your Perfect Property
                  </h2>
                  <div className="row g-4">
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">Property Type</label>
                      <select className="form-select form-select-lg">
                        <option>Any Type</option>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Commercial</option>
                        <option>Land</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">Location</label>
                      <select className="form-select form-select-lg">
                        <option>Any Location</option>
                        <option>Gulshan</option>
                        <option>Banani</option>
                        <option>Dhanmondi</option>
                        <option>Uttara</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">Price Range</label>
                      <select className="form-select form-select-lg">
                        <option>Any Price</option>
                        <option>$100,000 - $200,000</option>
                        <option>$200,000 - $400,000</option>
                        <option>$400,000 - $800,000</option>
                        <option>$800,000+</option>
                      </select>
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                      <button className="btn btn-primary btn-lg w-100 py-3">
                        <i className="bi bi-search me-2"></i>
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-3">Featured Properties</h2>
            <p className="lead text-muted">
              Discover our handpicked selection of premium properties in prime locations
            </p>
          </div>

          <div className="row g-4">
            {featuredProperties.map(property => (
              <div key={property.id} className="col-lg-3 col-md-6">
                <div className="card property-card h-100 border-0 shadow-sm hover-shadow">
                  <div className="position-relative overflow-hidden">
                    <img 
                      src={property.image} 
                      className="card-img-top property-image" 
                      alt={property.title}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-primary">{property.type}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-dark">{property.title}</h5>
                    <h4 className="text-primary fw-bold mb-2">{property.price}</h4>
                    <p className="text-muted mb-3">
                      <i className="bi bi-geo-alt me-2"></i>
                      {property.location}
                    </p>
                    <div className="row text-center border-top pt-3">
                      <div className="col-4">
                        <div className="fw-bold text-dark">{property.beds}</div>
                        <small className="text-muted">Beds</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-dark">{property.baths}</div>
                        <small className="text-muted">Baths</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-dark">{property.sqft}</div>
                        <small className="text-muted">Sq Ft</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/properties" className="btn btn-outline-primary btn-lg px-5">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-3">Our Services</h2>
            <p className="lead text-muted">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>

          <div className="row g-4">
            {services.map((service, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card service-card h-100 border-0 text-center shadow-sm hover-lift">
                  <div className="card-body p-4">
                    <div className="display-4 mb-3">{service.icon}</div>
                    <h4 className="fw-bold text-dark mb-3">{service.title}</h4>
                    <p className="text-muted">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <img 
                src="/assets/logo.png" 
                alt="Sardar Estate" 
                className="mb-3"
                style={{ width: '150px', height: 'auto' }}
              />
              <p className="text-light">
                Your trusted partner in real estate. We provide premium property solutions with integrity and excellence.
              </p>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/properties" className="text-light text-decoration-none">Properties</a></li>
                <li className="mb-2"><a href="/services" className="text-light text-decoration-none">Services</a></li>
                <li className="mb-2"><a href="/about" className="text-light text-decoration-none">About Us</a></li>
                <li className="mb-2"><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-3">Contact Info</h5>
              <ul className="list-unstyled text-light">
                <li className="mb-2"><i className="bi bi-telephone me-2"></i> +880 1234-567890</li>
                <li className="mb-2"><i className="bi bi-envelope me-2"></i> info@sardarestate.com</li>
                <li className="mb-2"><i className="bi bi-geo-alt me-2"></i> Gulshan Avenue, Dhaka</li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-3">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-light fs-5"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-light fs-5"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-light fs-5"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-light fs-5"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center text-light">
            <p className="mb-0">&copy; 2024 Sardar Real Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>
        {`
          .text-shadow {
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
          .hover-shadow:hover {
            transform: translateY(-5px);
            box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
            transition: all 0.3s ease;
          }
          .hover-lift:hover {
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
          .property-image {
            transition: transform 0.3s ease;
          }
          .property-card:hover .property-image {
            transform: scale(1.05);
          }
          .transition-all {
            transition: all 0.3s ease;
          }
        `}
      </style>
    </>
  );
};

export default HomePage;