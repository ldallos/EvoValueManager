import {useState, useEffect, FormEvent, ChangeEvent} from 'react';
import {Character} from '../interfaces/Character';
import {TRAITS} from '../constants/traits';

interface CharacterFormProps {
    initialData?: Character | null;
    onSubmit: (characterData: Omit<Character, 'id'> | Character) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

type CharacterFormData = Omit<Character, 'id'>;

const defaultFormData: Omit<Character, 'id'> = {
    name: '', bravery: 1, trust: 1, presence: 1, growth: 1, care: 1
};

function CharacterForm({initialData, onSubmit, onCancel, isSaving}: CharacterFormProps) {
    const [formData, setFormData] = useState<CharacterFormData>(() => {
        if (initialData) {
            const {id, ...rest} = initialData;
            return rest;
        }
        return {...defaultFormData};
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setFormData(initialData ? {...initialData} : {...defaultFormData});
        setErrors({});
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name || formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters long.";
        }
        TRAITS.forEach(trait => {
            const value = formData[trait.property as keyof CharacterFormData] as number;
            if (value < 1 || value > 100) {
                newErrors[trait.property] = `${trait.title} must be between 1 and 100.`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value
        }));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="character-form">
            <h3>{initialData ? 'Csapattag módosítása' : 'Csapattag felvétele'}</h3>

            <div className="form-group">
                <label htmlFor="name">Név:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={50}
                    required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {TRAITS.map(trait => (
                <div className="form-group" key={trait.property}>
                    <label htmlFor={trait.property}>{trait.title}:</label>
                    <input
                        type="number"
                        id={trait.property}
                        name={trait.property}
                        className="form-control"
                        value={formData[trait.property as keyof CharacterFormData]}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        required
                    />
                    {errors[trait.property] && <span className="error-message">{errors[trait.property]}</span>}
                </div>
            ))}

            <div className="form-actions">
                <button type="submit" disabled={isSaving} className="btn primary">
                    {isSaving ? 'Saving...' : (initialData ? 'Változtatások mentése' : 'Karakter felvétele')}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={isSaving} className="btn">
                        Mégsem
                    </button>
                )}
            </div>
            {errors.form && <p className="error-message">{errors.form}</p>}
        </form>
    );
}

export default CharacterForm;