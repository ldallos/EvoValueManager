// D:\Programming\CSharp\EvoValueManager\EvoValueManager.Server\Data\DatabaseSeeder.cs
using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Helpers;

namespace EvoCharacterManager.Data
{
    public class DatabaseSeeder : IDatabaseSeeder
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
                _context.Characters.AddRange(
                    new Character
                    {
                        Name = "Bátor Sándor",
                        Title = "Junior Pioneer",
                        Bravery = 30, Presence = 10, Trust = 5, Care = 10, Growth = 5
                    },
                    new Character
                    {
                        Name = "Bízom Balázs",
                        Title = "Team Player",
                        Bravery = 5, Presence = 10, Trust = 50, Care = 0, Growth = 15
                    },
                    new Character
                    {
                        Name = "Jelen Volt Zsolt",
                        Title = "Senior Mentor",
                        Bravery = 15, Presence = 35, Trust = 20, Care = 10, Growth = 10
                    }
                );
                _context.SaveChanges();
            }

            if (!_context.Challenges.Any())
            {
                _context.Challenges.AddRange(
                    new Challenge
                    {
                        Title = "Demózás",
                        GainableBravery = 10, RequiredTrust = 100, RequiredPresence = 5, RequiredGrowth = 5
                    },
                    new Challenge
                    {
                        Title = "Ügyféllátogatás",
                        GainableTrust = 3, RequiredBravery = 10
                    },
                    new Challenge
                    {
                        Title = "Mentorálás",
                        GainableTrust = 1, GainablePresence = 1, RequiredPresence = 5
                    }
                );
                _context.SaveChanges();
            }

            if (!_context.Tools.Any())
            {
                 _context.Tools.AddRange(
                    new Tool { Name = "Ergonomikus Szék", Description = "Kényelmes szék.", PresenceBonus = 5, CareBonus = 2 },
                    new Tool { Name = "Fejlesztői Laptop", Description = "Modern, gyors laptop.", GrowthBonus = 10, PresenceBonus = 3 },
                    new Tool { Name = "Programozási Szakkönyv", Description = "Haladó technikák.", GrowthBonus = 7 },
                    new Tool { Name = "Céges Bögre", Description = "Kávézáshoz.", CareBonus = 1 }
                );
                _context.SaveChanges();
            }

            if (!_context.Achievements.Any())
            {
                _context.Achievements.AddRange(
                    new Achievement { Name = "First Challenge", Description = "Complete your first challenge.", IconType = "completionist" },
                    new Achievement { Name = "Bravery Initiate", Description = "Reach 50 Bravery points.", IconType = "bravery" },
                    new Achievement { Name = "Growth Adept", Description = "Reach 50 Growth points.", IconType = "growth" },
                    new Achievement { Name = "Team Pillar", Description = "Reach 50 Trust points.", IconType = "trust" },
                    new Achievement { Name = "Presence Master", Description = "Reach 50 Presence points.", IconType = "presence" },
                    new Achievement { Name = "Caring Soul", Description = "Reach 50 Care points.", IconType = "care" }
                );
                _context.SaveChanges();
            }

            if (!_context.Managements.Any() && _context.Characters.Any() && _context.Challenges.Any())
            {
                var firstChar = _context.Characters.First();
                var firstChal = _context.Challenges.First();
                _context.Managements.Add(new Management
                {
                    CharacterId = firstChar.ID,
                    ChallengeId = firstChal.ID,
                    State = "Folyamatban",
                    Details = "Előre létrehozott megjegyzés."
                });
                _context.SaveChanges();
            }
        }
    }
}