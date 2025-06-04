namespace EvoCharacterManager.Helpers;

public static class NameGenerator
{
    private static readonly Random rnd = new();

    private static readonly string[] FirstNames = new[]
    {
        "Gábor", "Anna", "Péter", "Eszter", "Zoltán", "Katalin", "László", "Judit", "Miklós", "Zsófia",
        "Tamás", "Erika", "András", "Éva", "Balázs", "Klára", "István", "Réka", "János", "Melinda"
    };

    private static readonly string[] LastNames = new[]
    {
        "Nagy", "Kovács", "Tóth", "Szabó", "Horváth", "Varga", "Kiss", "Molnár", "Németh", "Farkas",
        "Balogh", "Lakatos", "Papp", "Vincze", "Szalai", "Mészáros", "Benedek", "Vass", "Sipos", "Szücs"
    };
    
    private static readonly string[] Challange_First = new[]
    {
        "Teszteld", "Mutasd", "Próbáld", "Teljesítsd", "Oldd meg", "Készülj fel", "Kezeld", "Szervezz", "Küzdj meg", "Tanulj"
    };

    private static readonly string[] Challange_Second = new[]
    {
        "az akadályt", "a kihívást", "a feladatot", "a vizsgát", "a versenyt", "az ügyfelet", "a problémát", "a kihívást", "a projektet", "a tréninget"
    };

    public static string GetRandomFullName()
    {
        string firstName = FirstNames[rnd.Next(FirstNames.Length)];
        string lastName = LastNames[rnd.Next(LastNames.Length)];
        return $"{lastName} {firstName}";
    }
    
    public static string GetRandomChallengeName()
    {
        var first = Challange_First[rnd.Next(Challange_First.Length)];
        var second = Challange_Second[rnd.Next(Challange_Second.Length)];
        return $"{first} {second}";
    }
}