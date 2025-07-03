import { STAT_NAMES } from './StatIcon';
import { Character } from '../interfaces/Character';
import {StatProgressBar} from './StatProgressBar';

interface CompactStatDisplayProps {
    character: Character;
}

export default function CompactStatDisplay({ character }: CompactStatDisplayProps) {
    return (
        <div className="flex flex-col items-start w-full">
            {STAT_NAMES.map(stat => (
                <StatProgressBar
                    key={stat}
                    statName={stat}
                    value={character[stat]}
                />
            ))}
        </div>
    );
}