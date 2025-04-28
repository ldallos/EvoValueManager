namespace EvoValueManager.Models.Shared;

public static class Constants
{
    public static class Traits
    {
        public const string TraitsFolder = "~/Content/Images/";

        public static readonly Trait[] Values =
        [
            new()
            {
                Title = "Fejlődés",
                Property = "Growth",
                ImageName = "fejlodes.png",
                ImageSmallName = "fejlodes_small.png",
                Description = "Hiszünk abban, hogy sikereink kulcsa tudásunk, mérnöki megoldásaink és adott szavunk megbízhatósága."
            },
            new()
            {
                Title = "Gondoskodás",
                Property = "Care",
                ImageName = "gondoskodas.png",
                ImageSmallName = "gondoskodas_small.png",
                Description = "Az élet minden területén jelen vagyunk, hatással vagyunk arra, hogy a jövőnk gördülékenyebb és élhetőbb legyen."
            },
            new()
            {
                Title = "Jelenlét",
                Property = "Presence",
                ImageName = "jelenlet.png",
                ImageSmallName = "jelenlet_small.png",
                Description = "Tudjuk, hogy minden helyzetben ott a szakmai fejlődés lehetősége, amihez te behozhatod saját személyiséged és érdeklődési köröd színességét is."
            },
            new()
            {
                Title = "Megbízhatóság",
                Property = "Trust",
                ImageName = "megbizhatosag.png",
                ImageSmallName = "megbizhatosag_small.png",
                Description = "Az evosoftban otthon vagyunk, törődünk egymással. A munkán kívül is színes közösséget alkotunk."
            },
            new()
            {
                Title = "Merészség",
                Property = "Bravery",
                ImageName = "mereszseg.png",
                ImageSmallName = "mereszseg_small.png",
                Description = "Folyamatosan a jobbító szándék vezérel minket. Merünk megkérdőjelezni és tenni."
            }
        ];
    }

    public class Trait
    {
        public string? Title { get; init; }
        public string? Property { get; init; }
        public string? ImageName { get; init; }
        public string? ImageSmallName { get; init; }
        public string? Description { get; init; }
        public string? Image => $"{Traits.TraitsFolder}{ImageName}";
        public string? ImageSmall => $"{Traits.TraitsFolder}{ImageSmallName}";
    }
}