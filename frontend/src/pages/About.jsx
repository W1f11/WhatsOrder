import React from "react";


const About = () => {
  return (
    <main className="about-body">
      <section className="about-section">
        <div className="container">
          <div className="content-wrapper">
            <div className="image-container">
              <img
                src="https://i.pinimg.com/1200x/13/b5/3e/13b53ec3b54837d0c43e47dca82ab4f1.jpg"
                alt="A plate of grilled chicken with fresh vegetables"
              />
            </div>
            <div className="text-container">
              <h1>Serving Best Food is<br />Our First Priority</h1>
              <p>
                Nutrients used in the body of an organism to sustain growth and
                vital processes and to furnish energy. The absorption and
                utilization of food by the body is fundamental to nutrition and
                is facilitated by digestion.
              </p>
              <button>Learn About Us</button>
            </div>
          </div>
        </div>
        
      </section>
    </main>
  );
};

export default About;
