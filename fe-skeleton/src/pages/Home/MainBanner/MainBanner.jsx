import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./MainBanner.css";
import OfflineMarket from "../../../assets/Offline-Market.png";
import OfflineOneday from "../../../assets/Offline-Oneday.png";

const banners = [
  {
    id: 1,
    image: OfflineMarket,
    title: "",
    subtitle: "",
    link: "#"
  },
  {
    id: 2,
    image: OfflineOneday,
    title: "",
    subtitle: "",
    link: "#"
  }
];

export function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = (banner) => {
    // 여기서 실제 링크로 이동하거나 다른 동작을 수행할 수 있습니다
    window.open(banner.link, '_blank');
  };

  return (
    <section className="banner-section">
      <div className="banner-container">
        <div className="banner-wrapper">
          {/* Banner slides */}
          <div className="banner-slides">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handleBannerClick(banner)}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="banner-image"
                />
                <div className="banner-overlay" />
                <div className="banner-content">
                  <h2 className="banner-title">{banner.title}</h2>
                  <p className="banner-subtitle">{banner.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Page indicator */}
          <div className="banner-page-indicator">
            {String(currentSlide + 1).padStart(2, '0')}/{String(banners.length).padStart(2, '0')}
          </div>

          {/* Navigation arrows */}
          <button
            className="banner-nav-btn banner-nav-prev"
            onClick={(e) => prevSlide(e)}
          >
            <ChevronLeft className="banner-nav-icon" />
          </button>
          <button
            className="banner-nav-btn banner-nav-next"
            onClick={(e) => nextSlide(e)}
          >
            <ChevronRight className="banner-nav-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}