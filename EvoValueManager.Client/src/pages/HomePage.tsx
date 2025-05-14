import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="home-page container">
      <div className="text-center">
        <h1 className="display-4">EvoValueManager</h1>
        <div className="values-intro">
          <p>{t("welcome")}</p>
          <p>{t("setEvoValue")}</p>
          <p>{t("homeDescription")}</p>
        </div>
      </div>

      {TRAITS.map((trait, index) => (
        <div
          key={trait.property}
          className={`values-container ${index % 2 !== 0 ? "mirror" : ""}`}
        >
          <div className="text-area">
            <h2>{trait.title}</h2>
            <p>{trait.description}</p>
          </div>
          <div className="image-area">
            <img src={trait.image} alt={trait.title} loading="lazy" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
