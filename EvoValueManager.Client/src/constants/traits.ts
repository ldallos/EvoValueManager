const TRAITS_FOLDER = "/images/";

export interface Trait {
    title: string;
    property: string;
    imageName: string;
    imageSmallName: string;
    description: string;
    image: string;
    imageSmall: string;
}

export const TRAITS: Trait[] = [
    {
        title: "Fejlődés",
        property: "growth",
        imageName: "fejlodes.png",
        imageSmallName: "fejlodes_small.png",
        description:
            "Hiszünk abban, hogy sikereink kulcsa tudásunk, mérnöki megoldásaink és adott szavunk megbízhatósága.",
        image: `${TRAITS_FOLDER}fejlodes.png`,
        imageSmall: `${TRAITS_FOLDER}fejlodes_small.png`,
    },
    {
        title: "Gondoskodás",
        property: "care",
        imageName: "gondoskodas.png",
        imageSmallName: "gondoskodas_small.png",
        description:
            "Az élet minden területén jelen vagyunk, hatással vagyunk arra, hogy a jövőnk gördülékenyebb és élhetőbb legyen.",
        image: `${TRAITS_FOLDER}gondoskodas.png`,
        imageSmall: `${TRAITS_FOLDER}gondoskodas_small.png`,
    },
    {
        title: "Jelenlét",
        property: "presence",
        imageName: "jelenlet.png",
        imageSmallName: "jelenlet_small.png",
        description:
            "Tudjuk, hogy minden helyzetben ott a szakmai fejlődés lehetősége, amihez te behozhatod saját személyiséged és érdeklődési köröd színességét is.",
        image: `${TRAITS_FOLDER}jelenlet.png`,
        imageSmall: `${TRAITS_FOLDER}jelenlet_small.png`,
    },
    {
        title: "Megbízhatóság",
        property: "trust",
        imageName: "megbizhatosag.png",
        imageSmallName: "megbizhatosag_small.png",
        description:
            "Az evosoftban otthon vagyunk, törődünk egymással. A munkán kívül is színes közösséget alkotunk.",
        image: `${TRAITS_FOLDER}megbizhatosag.png`,
        imageSmall: `${TRAITS_FOLDER}megbizhatosag_small.png`,
    },
    {
        title: "Merészség",
        property: "bravery",
        imageName: "mereszseg.png",
        imageSmallName: "mereszseg_small.png",
        description:
            "Folyamatosan a jobbító szándék vezérel minket. Merünk megkérdőjelezni és tenni.",
        image: `${TRAITS_FOLDER}mereszseg.png`,
        imageSmall: `${TRAITS_FOLDER}mereszseg_small.png`,
    },
];

export const CHALLENGE_STATES: { [key: number]: string } = {
    1: "Új",
    2: "Folyamatban",
    3: "Befejezett",
    4: "Felfüggesztett",
    5: "Megszakított",
};

export const getStateText = (stateId: number) => {
    return CHALLENGE_STATES[stateId] || CHALLENGE_STATES[1];
};

export const getStateId = (stateText: string) => {
    for (const id in CHALLENGE_STATES) {
        if (CHALLENGE_STATES[id] === stateText) {
            return parseInt(id, 10);
        }
    }
    return 1;
};
