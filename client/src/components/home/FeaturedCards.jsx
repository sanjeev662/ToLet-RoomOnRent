import React, { useRef, useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowRightAlt, MdImageSearch } from "react-icons/md";
import "../../assets/styles/featuredcards.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from 'swiper/modules';

import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css";

function FeaturedCards({ images ,type}) {

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <section className={`featuredopp feature-feature`}>
        <div className="featuredopp-container container">
          <div className="featuredopp-content">
            <h2>Some featured {type}</h2>
            <p>
              Get in these exceptional opportunities curated for the
              exceptional you!
            </p>
          </div>
          <Swiper
            spaceBetween={10}
            modules={[Autoplay, Pagination]}
            // pagination={{clickable: true}}
            slidesPerView={
              windowSize <= 900
                ? windowSize <= 800
                  ? 1
                  : 2
                : 3
            }
            autoplay={{
              delay: 2000,
              //   pauseOnMouseEnter: true,
              disableOnInteraction: true,
            }}
            loop={true}
            speed={800}
            // className='swiper-container'
          >
            {images.map((data) => {
              return (
                <SwiperSlide key={data._id}>
                 <Link to={`/detail/${data._id}`}>
                    <div className="featureopp-card">
                      <div className="featureopp-card-img">
                        <img src={data.photos[0]} alt="banner" />
                      </div>
                      <div className="featureopp-card-content">
                        <h4>{data.title}</h4>
                        <h5>{data.address}</h5>
                        {/* <h5>{data.price}</h5> */}
                        <div className="d-flex flex-row align-items-center mb-1">
                          <h4 className="me-1">₹{data.price}</h4>
                          <span className="text-danger">
                            <s>₹{data.price + 20}</s>
                          </span>
                        </div>
                        {/* <div className="featureopp-card-bottom">
                          <div className="card-badge">
                            <img
                              src="	https://d8it4huxumps7.cloudfront.net/uploads/images/63d1240708744_people_outline.svg"
                              alt="people"
                            />
                            <span>6,451 Registered</span>
                          </div>
                          <div className="card-badge">
                            <img
                              src="https://d8it4huxumps7.cloudfront.net/uploads/images/63c699aa6a592_calendar_today.svg"
                              alt="calendar"
                            />
                            <span>1 month left</span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
    </div>
  );
}

export default FeaturedCards;
