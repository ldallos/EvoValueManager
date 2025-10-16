using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using EvoValueManager.Models.Shared;
using System.Globalization;

namespace EvoCharacterManager.Helpers
{
    public static class SeedDataHelper
    {
        public static void Seed(CharacterManagerContext context)
        {
            var originalCulture = Thread.CurrentThread.CurrentUICulture;
            Thread.CurrentThread.CurrentUICulture = new CultureInfo("en-US");

            try
            {
                if (!context.Characters.Any())
                {
                    context.Characters.AddRange(
                        new Character
                        {
                            Name = "Bátor Sándor",
                            Title = "Junior Pioneer",
                            Bravery = 30, Trust = 45, Presence = 10, Care = 10, Growth = 25,
                        },
                        new Character
                        {
                            Name = "Bízom Balázs",
                            Title = "Team Player",
                            Bravery = 15, Trust = 50, Presence = 20, Care = 30, Growth = 40,
                        },
                        new Character
                        {
                            Name = "Jelen Volt Zsolt",
                            Title = "Senior Mentor",
                            Bravery = 20, Trust = 35, Presence = 55, Care = 45, Growth = 35,
                        },
                        new Character
                        {
                            Name = "Fejlődő Flóra",
                            Title = "Trainee",
                            Bravery = 5, Trust = 10, Presence = 5, Care = 15, Growth = 10,
                        }
                    );
                    context.SaveChanges();
                }

                if (!context.Tools.Any())
                {
                    context.Tools.AddRange(
                        new Tool
                        {
                            Name = "Ergonomic Chair",
                            Description = "A comfortable chair.",
                            PresenceBonus = 5,
                            CareBonus = 2
                        },
                        new Tool
                        {
                            Name = "Developer Laptop",
                            Description = "A modern, fast laptop.",
                            GrowthBonus = 10,
                            PresenceBonus = 3
                        },
                        new Tool
                        {
                            Name = "Programming Textbook",
                            Description = "Advanced techniques.",
                            GrowthBonus = 7
                        },
                        new Tool {
                             Name = "Company Mug",
                             Description = "For your coffee break.",
                             CareBonus = 1 },
                        new Tool
                        {
                            Name = "Rhetoric Guide",
                            Description = "Practical advice and tricks for effective presentations.",
                            BraveryBonus = 15
                        }
                    );
                    context.SaveChanges();
                }

                if (!context.Challenges.Any())
                {
                    context.Challenges.AddRange(
                        new Challenge
                        {
                            Title = "First Client Call",
                            RequiredBravery = 10,
                            GainableBravery = 5,
                            GainableTrust = 2
                        },
                        new Challenge {
                             Title = "Lead a Team Stand-up",
                             RequiredPresence = 30,
                             GainablePresence = 5 },
                        new Challenge
                        {
                            Title = "Internal Tech Presentation",
                            RequiredBravery = 40,
                            GainableBravery = 10,
                            GainableTrust = 5,
                            GainablePresence = 5
                        },
                        new Challenge
                        {
                            Title = "Mentor a Junior Colleague",
                            RequiredGrowth = 30,
                            RequiredCare = 30,
                            GainableGrowth = 5,
                            GainableCare = 5
                        },
                        new Challenge
                        {
                            Title = "Fix a Critical Production Bug",
                            RequiredTrust = 50,
                            RequiredBravery = 50,
                            GainableGrowth = 10,
                            GainableTrust = 10
                        }
                    );
                    context.SaveChanges();
                }

                if (!context.Achievements.Any())
                {
                    context.Achievements.AddRange(
                        new Achievement
                        {
                            Name = "First Challenge", Description = "Complete your first challenge.",
                            IconType = "completionist"
                        },
                        new Achievement
                        {
                            Name = "Bravery Initiate", Description = "Reach 50 bravery points.",
                            IconType = "bravery"
                        },
                        new Achievement
                            { Name = "Growth Adept", Description = "Reach 50 growth points.",
                                 IconType = "growth" },
                        new Achievement
                            { Name = "Team Pillar", Description = "Reach 50 trust points.",
                                 IconType = "trust" },
                        new Achievement
                        {
                            Name = "Presence Master", Description = "Reach 50 presence points.",
                            IconType = "presence"
                        },
                        new Achievement
                        {
                            Name = "Caring Soul", Description = "Reach 50 care points.",
                            IconType = "care"
                        }
                    );
                    context.SaveChanges();
                }

                if (!context.Managements.Any() && context.Characters.Any() && context.Challenges.Any())
                {
                    var jvZs = context.Characters.First(c => c.Name == "Jelen Volt Zsolt");
                    var standupChallenge = context.Challenges.First(c => c.Title == "Lead a Team Stand-up");

                    context.Managements.Add(new Management
                    {
                        CharacterId = jvZs.ID,
                        ChallengeId = standupChallenge.ID,
                        StateId = 2,
                        Details = "Weekly team sync meeting.",
                        IsClosed = false
                    });

                    var bb = context.Characters.First(c => c.Name == "Bízom Balázs");
                    var clientCallChallenge = context.Challenges.First(c => c.Title == "First Client Call");

                    context.Managements.Add(new Management
                    {
                        CharacterId = bb.ID,
                        ChallengeId = clientCallChallenge.ID,
                        StateId = 3,
                        Details = "Successfully completed the first client introduction call.",
                        IsClosed = true
                    });
                }

                if (!context.CharacterTools.Any() && context.Characters.Any() && context.Tools.Any())
                {
                    var bb = context.Characters.First(c => c.Name == "Bízom Balázs");
                    var laptopTool = context.Tools.First(t => t.Name == "Developer Laptop");

                    context.CharacterTools.Add(new CharacterTool
                    {
                        CharacterId = bb.ID,
                        ToolId = laptopTool.Id
                    });
                }
                context.SaveChanges();
            }
            finally
            {
                Thread.CurrentThread.CurrentUICulture = originalCulture;
            }
        }
    }
}