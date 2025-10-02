import { 
  Sparkles, 
  Percent, 
  Users, 
  User, 
  Zap, 
  Shirt, 
  Square,
  Watch,
  Star 
} from "lucide-react";
import "./CategoryGrid.css";

const categories = [
  { id: 1, name: "신상품", icon: Sparkles, color: "pink" },
  { id: 2, name: "세일/할인", icon: Percent, color: "red" },
  { id: 3, name: "남성 의류", icon: Users, color: "blue" },
  { id: 4, name: "여성 의류", icon: User, color: "purple" },
  { id: 5, name: "아우터", icon: Zap, color: "green" },
  { id: 6, name: "상의", icon: Shirt, color: "orange" },
  { id: 7, name: "하의", icon: Square, color: "indigo" },
  { id: 8, name: "액세서리", icon: Watch, color: "yellow" },
  { id: 9, name: "추천 상품", icon: Star, color: "amber" }
];

export function CategoryGrid() {
  return (
    <section className="category-section">
      <div className="category-container">
        <div className="category-scroll-wrapper">
          <div className="category-grid">
            {categories.map((category) => {
              const IconComponent = category.icon;
              
              return (
                <div
                  key={category.id}
                  className="category-item"
                >
                  <div className={`category-icon-wrapper ${category.color}`}>
                    <IconComponent className="category-icon" />
                  </div>
                  <span className="category-name">
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}