using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Helpers;
using System;

namespace EvoCharacterManager.Data
{
    public static class DatabaseSeeder
    {
        private static readonly Random rnd = new();

        public static void SeedInitialData(CharacterManagerContext context)
        {
            if (!context.Characters.Any())
            {
                for (int i = 0; i < 200; i++)
                {
                    context.Characters.Add(new Character
                    {
                        Name = NameGenerator.GetRandomFullName(),
                        Bravery = rnd.Next(1, 100),
                        Presence = rnd.Next(1, 100),
                        Trust = rnd.Next(1, 100),
                        Care = rnd.Next(1, 100),
                        Growth = rnd.Next(1, 100)
                    });
                }

                for (int i = 1; i <= 10; i++)
                {
                    context.Challenges.Add(new Challenge
                    {
                        Title = NameGenerator.GetRandomChallengeName(),
                        GainableBravery = rnd.Next(0, 20),
                        GainablePresence = rnd.Next(0, 20),
                        GainableTrust = rnd.Next(0, 20),
                        GainableCare = rnd.Next(0, 20),
                        GainableGrowth = rnd.Next(0, 20),
                        RequiredBravery = rnd.Next(0, 50),
                        RequiredPresence = rnd.Next(0, 50),
                        RequiredTrust = rnd.Next(0, 50),
                        RequiredCare = rnd.Next(0, 50),
                        RequiredGrowth = rnd.Next(0, 50)
                    });
                }

                context.SaveChanges();
            }
        }
    }
}