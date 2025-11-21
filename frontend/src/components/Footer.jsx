import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h3>Contact</h3>
        <p><FaPhoneAlt className="icon" /> 602-774-4735</p>
        <p>
          <FaMapMarkerAlt className="icon" /> Boulvard AbdAlmoumen 20520, Casablanca
          
        </p>
        <p><FaEnvelope className="icon" /> hi@foodieapp.com</p>
      </div>

      <div className="footer-column">
        <h3>Navigate</h3>
        <ul>
          <li><a href="#">Accueil</a></li>
          <li><a href="#">Menu</a></li>
          <li><a href="#">About</a></li>
          
        </ul>
      </div>

      <div className="footer-column">
        <h3>Menu</h3>
        <ul>
          <li><a href="#">burgers</a></li>
          <li><a href="#">Sandwich</a></li>
          <li><a href="#">meat</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h3>Follow Us</h3>
        <ul>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">Twitter</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;