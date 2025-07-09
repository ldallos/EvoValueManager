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
        title: "traits.growth_title",
        property: "growth",
        imageName: "fejlodes.png",
        imageSmallName: "fejlodes_small.png",
        description: "traits.growth_description",
        image: `${TRAITS_FOLDER}fejlodes.png`,
        imageSmall: `${TRAITS_FOLDER}fejlodes_small.png`,
    },
    {
        title: "traits.care_title",
        property: "care",
        imageName: "gondoskodas.png",
        imageSmallName: "gondoskodas_small.png",
        description: "traits.care_description",
        image: `${TRAITS_FOLDER}gondoskodas.png`,
        imageSmall: `${TRAITS_FOLDER}gondoskodas_small.png`,
    },
    {
        title: "traits.presence_title",
        property: "presence",
        imageName: "jelenlet.png",
        imageSmallName: "jelenlet_small.png",
        description: "traits.presence_description",
        image: `${TRAITS_FOLDER}jelenlet.png`,
        imageSmall: `${TRAITS_FOLDER}jelenlet_small.png`,
    },
    {
        title: "traits.trust_title",
        property: "trust",
        imageName: "megbizhatosag.png",
        imageSmallName: "megbizhatosag_small.png",
        description: "traits.trust_description",
        image: `${TRAITS_FOLDER}megbizhatosag.png`,
        imageSmall: `${TRAITS_FOLDER}megbizhatosag_small.png`,
    },
    {
        title: "traits.bravery_title",
        property: "bravery",
        imageName: "mereszseg.png",
        imageSmallName: "mereszseg_small.png",
        description: "traits.bravery_description",
        image: `${TRAITS_FOLDER}mereszseg.png`,
        imageSmall: `${TRAITS_FOLDER}mereszseg_small.png`,
    },
];
