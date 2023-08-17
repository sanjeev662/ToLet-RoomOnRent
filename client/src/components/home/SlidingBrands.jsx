import React, { useRef, useEffect,useState } from "react";
import "../../assets/styles/slidingbrands.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';

const SlidingBrands = ({ small, title }) => {
  const brands = [
    require("../../assets/media/images/cityicon/city1.png"),
    require("../../assets/media/images/cityicon/city2.png"),
    require("../../assets/media/images/cityicon/city3.png"),
    require("../../assets/media/images/cityicon/city4.png"),
    require("../../assets/media/images/cityicon/city5.png"),    
    require("../../assets/media/images/cityicon/city6.png"),   
    require("../../assets/media/images/cityicon/city7.png"),
    require("../../assets/media/images/cityicon/city1.png"),
    require("../../assets/media/images/cityicon/city2.png"),
    require("../../assets/media/images/cityicon/city3.png"),
    require("../../assets/media/images/cityicon/city4.png"),
    require("../../assets/media/images/cityicon/city5.png"),    
    require("../../assets/media/images/cityicon/city6.png"),   
    require("../../assets/media/images/cityicon/city7.png"),
  ];

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="slidingbrands">
      <div className="slidingbrands-container">
        <h2>
          {small}
          <span>{title}</span>
        </h2>
        <div className="brands-container mt-3">
          <Swiper
            spaceBetween={1}
            slidesPerView={
              windowSize <= 900
                ? windowSize <= 800
                  ? 3
                  : 4
                : 6
            }
            autoplay={{
              delay: 3500,
              disableOnInteraction: true,
            }}
            loop={true}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay]}
            speed={2000}
          >
            {brands.map((ele, i) => {
              return (
                <SwiperSlide key={i}>
                  <img
                    src={ele}
                    alt={"brand"}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default SlidingBrands;
