import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";

function HomePage() {
    const { t } = useTranslation();
    return (
        <div className="space-y-12">
            <div className="text-center py-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    <span className="text-evogreen">Evo</span>ValueManager
                </h1>
                <div className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 space-y-2">
                    <p>{t("welcome")}</p>
                    <p>{t("setEvoValue")}</p>
                    <p>{t("homeDescription")}</p>
                </div>
            </div>

            <div className="space-y-16">
                {TRAITS.map((trait, index) => (
                    <div
                        key={trait.property}
                        className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12"
                    >
                        <div
                            className={`p-6 bg-gray-100 rounded-lg ${index % 2 !== 0 ? "md:order-last" : ""}`}
                        >
                            <img
                                src={trait.image}
                                alt={trait.title}
                                className="w-full h-auto max-h-72 object-contain"
                                loading="lazy"
                            />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold text-gray-800">{trait.title}</h2>
                            <p className="text-gray-600 leading-relaxed">{trait.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
