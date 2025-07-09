import { useTranslation } from "react-i18next";
import { TRAITS } from "../constants/traits";
import AnimatedDiv from "../components/ui/AnimatedDiv";
import HeroSection from "../components/ui/HeroSection";

function HomePage() {
    const { t } = useTranslation();

    return (
        <>
            <HeroSection />

            <div
                id="values-section"
                className="container mx-auto py-16 sm:py-24 space-y-24 md:space-y-32"
            >
                {TRAITS.map((trait, index) => (
                    <AnimatedDiv
                        key={trait.property}
                        delay={index}
                    >
                        <div
                            className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${
                                index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                        >
                            <div className="w-full md:w-1/2 flex justify-center">
                                <div className="relative w-72 h-72 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl">
                                    <img
                                        src={trait.image}
                                        alt={t(trait.title)}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                    <img
                                        src={trait.imageSmall}
                                        alt={`${t(trait.title)} icon`}
                                        className="w-12 h-12"
                                    />
                                    <h2 className="text-3xl font-bold text-white">
                                        {t(trait.title)}
                                    </h2>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {t(trait.description)}
                                </p>
                            </div>
                        </div>
                    </AnimatedDiv>
                ))}
            </div>
        </>
    );
}

export default HomePage;
