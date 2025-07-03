import { motion, Variants } from 'framer-motion';
import React from 'react';

interface AnimatedDivProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const cardVariants: Variants = {
    offscreen: {
        y: 20,
        opacity: 0,
    },
    onscreen: (delay: number = 0) => ({
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            bounce: 0.4,
            duration: 0.8,
            delay: delay * 0.1,
        },
    }),
};

export default function AnimatedDiv({ children, className, delay = 0 }: AnimatedDivProps) {
    return (
        <motion.div
            className={className}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={cardVariants}
            custom={delay}
        >
            {children}
        </motion.div>
    );
}