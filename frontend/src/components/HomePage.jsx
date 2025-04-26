import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaUserMd, FaClinicMedical, FaSignInAlt } from 'react-icons/fa';
import './HomePage.css'

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            Welcome to <span className="highlight">HealthConnect</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-subtitle"
          >
            Your comprehensive healthcare management system
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link to="/login" className="cta-button">
              <FaSignInAlt className="button-icon" />
              Login to Your Dashboard
            </Link>
          </motion.div>
        </div>
        
        <div className="hero-image">
          <div className="pulse-animation">
            <FaHeartbeat className="heart-icon" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our System?</h2>
        
        <div className="features-grid">
          <motion.div 
            whileHover={{ y: -10 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <FaUserMd />
            </div>
            <h3>Patient Management</h3>
            <p>Efficiently track and manage all patient records in one secure platform.</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -10 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <FaClinicMedical />
            </div>
            <h3>Program Enrollment</h3>
            <p>Easily enroll patients in specialized health programs and track progress.</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -10 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <FaHeartbeat />
            </div>
            <h3>Comprehensive Care</h3>
            <p>Integrated system for complete healthcare service management.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="footer-cta"
      >
        <h2>Ready to Transform Your Healthcare Experience?</h2>
        <Link to="/login" className="cta-button secondary">
          Get Started Now
        </Link>
      </motion.section>
    </div>
  );
};

export default HomePage;

