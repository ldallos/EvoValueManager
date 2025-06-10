namespace EvoCharacterManager.Helpers;

public class NameGenerator
{
    private readonly Random _rnd = new();

    private readonly string[] FirstNames = new[]
    {
        "Gábor", "Anna", "Péter", "Eszter", "Zoltán", "Katalin", "László", "Judit", "Miklós", "Zsófia",
        "Tamás", "Erika", "András", "Éva", "Balázs", "Klára", "István", "Réka", "János", "Melinda"
    };

    private readonly string[] LastNames = new[]
    {
        "Nagy", "Kovács", "Tóth", "Szabó", "Horváth", "Varga", "Kiss", "Molnár", "Németh", "Farkas",
        "Balogh", "Lakatos", "Papp", "Vincze", "Szalai", "Mészáros", "Benedek", "Vass", "Sipos", "Szücs"
    };
    
    private readonly string[] Challange_First = new[]
    {
        "Teszteld", "Mutasd", "Próbáld", "Teljesítsd", "Oldd meg", "Készülj fel", "Kezeld", "Szervezz", "Küzdj meg", "Tanulj"
    };

    private readonly string[] Challange_Second = new[]
    {
        "az akadályt", "a kihívást", "a feladatot", "a vizsgát", "a versenyt", "az ügyfelet", "a problémát", "a kihívást", "a projektet", "a tréninget"
    };

    public string GetRandomFullName()
    {
        string firstName = FirstNames[_rnd.Next(FirstNames.Length)];
        string lastName = LastNames[_rnd.Next(LastNames.Length)];
        return $"{lastName} {firstName}";
    }
    
    public string GetRandomChallengeName()
    {
        var first = Challange_First[_rnd.Next(Challange_First.Length)];
        var second = Challange_Second[_rnd.Next(Challange_Second.Length)];
        return $"{first} {second}";
    }
}