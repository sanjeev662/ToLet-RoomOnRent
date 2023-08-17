import React from "react";

function Testimonial({ testimonial }) {
  const rating = parseInt(testimonial.user_rating);

  const starIcons = [];
  for (let i = 0; i < rating; i++) {
    starIcons.push(<i key={i} className="fas fa-star" />);
  }

  return (
    <div className="user-panel">
      <div className="user-avatar-lg mb-4 pb-4">
        <img
          className="user-avatar img-fluid mx-auto d-block"
          src={testimonial.user_image}
        />
      </div>
      <i className="fa-solid fa-quote-right fa-flip-horizontal quote-default quote-start" />
      <div className="user-testimonials">
        <div className="user-rating-container">
          <div className="user-rating float-end">
            <div className="user-rating-icon">{starIcons}</div>
          </div>
        </div>
        <div className="user-testimonials-container">
          <p className="user-testimonials-text-title">
            {testimonial.user_name}
          </p>
          <p className="user-testimonials-text">
            {testimonial.user_testimonial}
          </p>
        </div>
      </div>
      <i className="fa-solid fa-quote-right quote-default quote-end" />
    </div>
  );
}

export default Testimonial;
