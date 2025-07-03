import { Trait } from '../constants/traits';
import AnimatedDiv from './ui/AnimatedDiv';
import StatIcon, { StatName } from './StatIcon';

interface ValueCardProps {
    trait: Trait;
    index: number;
}

export default function ValueCard({ trait, index }: ValueCardProps) {
    return (
        <AnimatedDiv delay={index}>
            <div className="bg-slate-800/50 p-6 rounded-xl h-full border border-slate-700 transition-all duration-300 hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/20 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-700">
                        <StatIcon stat={trait.property as StatName} className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{trait.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed flex-grow">{trait.description}</p>
            </div>
        </AnimatedDiv>
    );
}