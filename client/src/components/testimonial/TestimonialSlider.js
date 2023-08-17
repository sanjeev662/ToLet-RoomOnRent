import React, { useState, useEffect } from "react";
import Testimonial from "./Testimonial";
import { url } from "../../utils/Constants";
import swal from "sweetalert";


const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${url}/testimonial`);
        const data = await response.json();
        setTestimonials(data);
      } catch (err) {
        swal({
          title: "Try Again!",
          text: "server is down!",
          icon: "error",
          button: "Ok!",
        });
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(
        (currentIndex) => (currentIndex + 1) % testimonials.length
      );
    }, 10000);

    return () => clearInterval(intervalId);
  }, [testimonials]);

  // Validate testimonials array and set default value
  const testimonial =
    Array.isArray(testimonials) && testimonials[currentIndex]
      ? testimonials[currentIndex]
      : {};

  const handlePrevClick = () => {
    setCurrentIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <div className="testimonial-slider">
      <Testimonial testimonial={testimonial} />
      <div className="testimonial-controls">
        <button onClick={handlePrevClick} className="testimonial-previous">
          <img src={require("../../assets/media/images/leftarrow_icon.png")} />
        </button>
        {currentIndex + 1}/{testimonials.length}
        <button onClick={handleNextClick} className="testimonial-next">
          <img src={require("../../assets/media/images/rightarrow_icon.png")} />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
