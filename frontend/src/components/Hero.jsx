import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRestaurants } from "../api/restaurant";
import restaurantImg from "../assets/restaurant.jpg";

// Composant pour l'animation d'incrémentation
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = countRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (element) {
      observer.observe(element);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const startCounter = () => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function pour un effet plus naturel
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <h3 ref={countRef}>
      {count}{suffix}
    </h3>
  );
};

export default function Hero() {
  const navigate = useNavigate();
  const [firstRestaurantId, setFirstRestaurantId] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const reps = await fetchRestaurants();
        if (!mounted) return;
        if (Array.isArray(reps) && reps.length > 0) {
          setFirstRestaurantId(reps[0].restaurantID ?? reps[0].id ?? null);
        }
      } catch {
        // ignore: we will fallback to /menu if no id
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleMakeOrder = () => {
    if (firstRestaurantId) {
      navigate(`/restaurant/${firstRestaurantId}`);
    } else {
      // fallback to menu page if we couldn't resolve an id
      navigate(`/restaurant/26`);
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">

        {/* LEFT TEXT */}
        <div className="hero-textbox">
          <h1 className="hero-title">
            Experience the art of <span>fine dinning</span>
          </h1>

          <p className="hero-subtitle">
            Delicious food, cozy ambiance and unforgettable memories — all in one place.
          </p>

          <div className="hero-buttons">
            <button className="hero-btn" onClick={handleMakeOrder}>Make Order</button>
            <button className="hero-btn outline">Book A Table</button>
          </div>

          {/* Separator */}
          <div className="hero-separator"></div>

          {/* Stats avec animation */}
          <div className="hero-stats">
            <div className="stat-box">
              <AnimatedCounter end={120} suffix="+" />
              <p>Food Items</p>
            </div>
            <div className="stat-box">
              <AnimatedCounter end={1200} suffix="+" duration={2500} />
              <p>Daily Orders</p>
            </div>
            <div className="stat-box">
              <AnimatedCounter end={20} suffix="+" />
              <p>Best Chefs</p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-image">
          <img src={restaurantImg} alt="Fine dining" />
        </div>

      </div>
    </section>
  );
}