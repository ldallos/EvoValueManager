import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronsDown } from 'lucide-react';
import Button from './Button';
import { useTranslation } from 'react-i18next';

const fadeIn_variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.8,
            ease: "easeOut",
        },
    }),
};

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <section className="flex items-center justify-center text-center min-h-[calc(100vh-4rem)] -mt-10 px-4 sm:px-6 lg:px-8">

            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900/40" />

            <div
                className="absolute inset-0 -z-10 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'radial-gradient(var(--color-slate-700) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                }}
            />

            <div className="relative z-0 max-w-4xl mx-auto">
                <motion.h1
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn_variants}
                    className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
                >
                    <span className="text-indigo-400">Evo</span>ValueManager
                </motion.h1>

                <motion.p
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn_variants}
                    className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto"
                >
                    {t('heroSubtitle', 'A modern platform to visualize growth, manage challenges, and evolve the core values of your team.')}
                </motion.p>

                <motion.div
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn_variants}
                    className="mt-10"
                >
                    <Button as={Link} to="/dashboard" variant="primary" className="px-8 py-3 text-lg font-semibold">
                        View Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </div>

            {/* Animated Scroll Down Indicator */}
            <motion.a
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeIn_variants}
                href="#values-section"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label="Scroll to values section"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronsDown className="w-8 h-8" />
                </motion.div>
            </motion.a>
        </section>
    );
}

