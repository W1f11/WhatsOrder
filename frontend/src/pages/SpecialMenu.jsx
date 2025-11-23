import React from "react";
import { useNavigate } from 'react-router-dom';

const menuItems = [
  {
    title: "Burger chicken",
    image:
      "https://i.pinimg.com/736x/c9/c5/01/c9c5013a47c78dde12d22a8659cdb945.jpg",
  },
  {
    title: "Pizza Margherita",
    image:
      "https://i.pinimg.com/736x/ab/e6/57/abe65721a6d06545c99230151aab0177.jpg",
  },
  {
    title: "Sandwish",
    image:
      "https://i.pinimg.com/1200x/61/14/d9/6114d944cd54f680b442da7175d5c6fb.jpg",
  },
];

export default function SpecialMenu() {
  const navigate = useNavigate();

  const handleMakeOrder = () => {
    // simple behavior: go to menu page (you can change to a specific restaurant route)
    navigate('/restaurant/26');
  };
  return (
    <div className="special-container">
      <header className="special-header">
        <p className="special-subtitle">Special Menu</p>
        <h1 className="special-title">Today's Special</h1>
        <p className="special-text">
          Special menu oftenly comes different everyday, this is our special food for today
        </p>
      </header>

      <div className="cards-grid">
        {menuItems.map((item, i) => (
          <div className="card" key={i}>
            <img loading="lazy" src={item.image} alt={item.title} className="card-image" />

            <div className="card-body">
              <h2 className="card-title">{item.title}</h2>
              <p className="card-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut imperdiet lectus.
              </p>

              <div className="stars">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <span key={j} className="star">★</span>
                  ))}
              </div>

              <button className="order-btn" onClick={handleMakeOrder}>
                ORDER NOW <span className="line"></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
