using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Helpers;

namespace EvoCharacterManager.Data
{
    public class DatabaseSeeder
    {
        private readonly CharacterManagerContext _context;
        private readonly Random _rnd = new();
        private readonly NameGenerator _nameGenerator;

        public DatabaseSeeder(CharacterManagerContext context, NameGenerator nameGenerator)
        {
            _context = context;
            _nameGenerator = nameGenerator;
        }

        public void SeedInitialData()
        {
            if (!_context.Characters.Any())
            {
                _context.Characters?.Add(new Character
                {
                    Name = "Bátor Sándor",
                    Bravery = 30,
                    Presence = 10,
                    Trust = 5,
                    Care = 10,
                    Growth = 5
                });
                _context.Characters?.Add(new Character
                {
                    Name = "Bízom Balázs",
                    Bravery = 5,
                    Presence = 10,
                    Trust = 50,
                    Care = 0,
                    Growth = 15
                });
                _context.Characters?.Add(new Character
                {
                    Name = "Jelen Volt Zsolt",
                    Bravery = 15,
                    Presence = 35,
                    Trust = 20,
                    Care = 10,
                    Growth = 10
                });
                for (int i = 0; i < 200; i++)
                {
                    _context.Characters.Add(new Character
                    {
                        Name = _nameGenerator.GetRandomFullName(),
                        Bravery = _rnd.Next(1, 100),
                        Presence = _rnd.Next(1, 100),
                        Trust = _rnd.Next(1, 100),
                        Care = _rnd.Next(1, 100),
                        Growth = _rnd.Next(1, 100)
                    });
                }

                _context.Challenges?.Add(new Challenge
                {
                    Title = "Demózás",
                    GainableBravery = 10,
                    RequiredBravery = 0,
                    RequiredTrust = 100,
                    RequiredPresence = 5,
                    RequiredCare = 0,
                    RequiredGrowth = 5
                });
                _context.Challenges?.Add(new Challenge
                {
                    Title = "Ügyféllátogatás",
                    GainableTrust = 3,
                    RequiredBravery = 10,
                    RequiredTrust = 0,
                    RequiredPresence = 0,
                    RequiredCare = 0,
                    RequiredGrowth = 0
                });
                _context.Challenges?.Add(new Challenge
                {
                    Title = "Mentorálás",
                    GainableTrust = 1,
                    GainablePresence = 1,
                    RequiredBravery = 0,
                    RequiredTrust = 0,
                    RequiredPresence = 5,
                    RequiredCare = 0,
                    RequiredGrowth = 0
                });
                for (int i = 1; i <= 10; i++)
                {
                    _context.Challenges.Add(new Challenge
                    {
                        Title = _nameGenerator.GetRandomChallengeName(),
                        GainableBravery = _rnd.Next(0, 20),
                        GainablePresence = _rnd.Next(0, 20),
                        GainableTrust = _rnd.Next(0, 20),
                        GainableCare = _rnd.Next(0, 20),
                        GainableGrowth = _rnd.Next(0, 20),
                        RequiredBravery = _rnd.Next(0, 50),
                        RequiredPresence = _rnd.Next(0, 50),
                        RequiredTrust = _rnd.Next(0, 50),
                        RequiredCare = _rnd.Next(0, 50),
                        RequiredGrowth = _rnd.Next(0, 50)
                    });
                }
                
                _context.Managements?.Add(new Management
                {
                    CharacterId = 1,
                    ChallangeId = 1,
                    State = "Folyamatban",
                    Details = "Előre létrehozott megjegyzés."
                });
                
                _context.Tools?.Add(new Tool
                {
                    Name = "Ergonomikus Szék",
                    Description = "Kényelmes szék a hosszabb munkához.",
                    PresenceBonus = 5,
                    CareBonus = 2
                });
                _context.Tools?.Add(new Tool
                {
                    Name = "Fejlesztői Laptop",
                    Description = "Modern, gyors laptop a hatékony kódoláshoz.",
                    GrowthBonus = 10,
                    PresenceBonus = 3
                });
                _context.Tools?.Add(new Tool
                {
                    Name = "Programozási Szakkönyv",
                    Description = "Haladó technikák elsajátításához.",
                    GrowthBonus = 7
                });
                _context.Tools?.Add(new Tool
                {
                    Name = "Céges Bögre", 
                    Description = "Kávézáshoz", 
                    CareBonus = 1
                });

                _context.SaveChanges();
            }
        }
    }
}