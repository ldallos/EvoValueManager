using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Data
{
    public class InMemoryDatabaseSeeder : IDatabaseSeeder
    {
        private readonly CharacterManagerContext _context;

        public InMemoryDatabaseSeeder(CharacterManagerContext context)
        {
            _context = context;
        }

        public void SeedInitialData()
        {
            _context.Characters.AddRange(
                new Character
                {
                    Name = "Bátor Sándor", Bravery = 30, Presence = 10, Trust = 5, Care = 10, Growth = 5
                },
                new Character
                {
                    Name = "Bízom Balázs", Bravery = 5, Presence = 10, Trust = 50, Care = 0, Growth = 15
                },
                new Character
                    { Name = "Jelen Volt Zsolt", Bravery = 15, Presence = 35, Trust = 20, Care = 10, Growth = 10 }
            );

            _context.Challenges.AddRange(
                new Challenge
                {
                    Title = "Demózás",
                    GainableBravery = 10,
                    RequiredTrust = 100,
                    RequiredPresence = 5,
                    RequiredGrowth = 5
                },
                new Challenge
                {
                    Title = "Ügyféllátogatás",
                    GainableTrust = 3,
                    RequiredBravery = 10
                },
                new Challenge
                {
                    Title = "Mentorálás",
                    GainableTrust = 1,
                    GainablePresence = 1,
                    RequiredPresence = 5
                }
            );

            _context.Managements.AddRange(
                new Management
                {
                    CharacterId = 1, ChallengeId = 1, State = "Folyamatban", Details = "Előre létrehozott megjegyzés."
                }
            );

            _context.Tools.AddRange(
                new Tool
                {
                    Name = "Ergonomikus Szék", Description = "Kényelmes szék a hosszabb munkához.", PresenceBonus = 5,
                    CareBonus = 2
                },
                new Tool
                {
                    Name = "Fejlesztői Laptop", Description = "Modern, gyors laptop a hatékony kódoláshoz.",
                    GrowthBonus = 10, PresenceBonus = 3
                },
                new Tool
                {
                    Name = "Programozási Szakkönyv", Description = "Haladó technikák elsajátításához.", GrowthBonus = 7
                },
                new Tool
                {
                    Name = "Céges Bögre", Description = "Kávézáshoz", CareBonus = 1
                }
            );

            _context.Achievements.AddRange(
                new Achievement
                {
                    Name = "First Challenge", Description = "Complete your first challenge.", IconType = "completionist"
                },
                new Achievement
                {
                    Name = "Bravery Initiate", Description = "Reach 50 Bravery points.", IconType = "bravery"
                },
                new Achievement
                {
                    Name = "Growth Adept", Description = "Reach 50 Growth points.", IconType = "growth"
                },
                new Achievement
                {
                    Name = "Team Pillar", Description = "Reach 50 Trust points.", IconType = "trust"
                }
            );

            _context.SaveChanges();
        }
    }
}