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

                _context.SaveChanges();
            }
        }
    }
}