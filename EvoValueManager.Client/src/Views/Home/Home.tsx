import React from 'react';

const Constants = {
    Traits: [
        {
            Title : "Fejlődés",
            ImageName : "/Content/Images/fejlodes.png",
            ImageSmallName : "/Content/Images/fejlodes_small.png",
            Property : "Growth",
            Description : "Hiszünk abban, hogy sikereink kulcsa tudásunk, mérnöki megoldásaink és adott szavunk megbízhatósága."
        },
        {
            Title : "Gondoskodás",
            Property : "Care",
            ImageName : "/Content/Images/gondoskodas.png",
            ImageSmallName : "/Content/Images/gondoskodas_small.png",
            Description : "Az élet minden területén jelen vagyunk, hatással vagyunk arra, hogy a jövőnk gördülékenyebb és élhetőbb legyen."
        },
        {
            Title : "Jelenlét",
            Property : "Presence",
            ImageName : "/Content/Images/jelenlet.png",
            ImageSmallName : "/Content/Images/jelenlet_small.png",
            Description : "Tudjuk, hogy minden helyzetben ott a szakmai fejlődés lehetősége, amihez te behozhatod saját személyiséged és érdeklődési köröd színességét is."
        },
        {
            Title : "Megbízhatóság",
            Property : "Trust",
            ImageName : "/Content/Images/megbizhatosag.png",
            ImageSmallName : "/Content/Images/megbizhatosag_small.png",
            Description : "Az evosoftban otthon vagyunk, törődünk egymással. A munkán kívül is színes közösséget alkotunk."
        },
        {
            Title : "Merészség",
            Property : "Bravery",
            ImageName : "/Content/Images/mereszseg.png",
            ImageSmallName : "/Content/Images/mereszseg_small.png",
            Description : "Folyamatosan a jobbító szándék vezérel minket. Merünk megkérdőjelezni és tenni."
        }
    ]
};

function Home() {
    return (
        <>
            <h2>Evo Értékeink</h2>
            <div className="evo-details-margin">
                <div className="values-intro">
                    <p>Üdvözöllek az Evo Értékeink oldalán!</p>
                    <p>Itt tudod kezelni a csapattagjaid evosoftos értékeit.</p>
                    <p>Ha valakinek fejlődésre lenne szükséges, keress megfelelő kihívásokat számára és itt ezt nyomon tudod követni.</p>
                </div>
                {Constants.Traits.map((trait, index) => (
                    <div className={`values-container ${index % 2 === 0 ? "mirror" : ""}`} key={index}>
                         <div className="text-area">
                            {trait.Description}
                         </div>
                         <div className="image-area">
                            <img src={trait.ImageName} alt={trait.Description} />
                         </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Home;