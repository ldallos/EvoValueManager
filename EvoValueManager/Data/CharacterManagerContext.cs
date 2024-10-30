using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Data
{
    public class CharacterManagerContext : DbContext
    {
        public CharacterManagerContext(DbContextOptions<CharacterManagerContext> options) : base(options)
        {
            // WARNING: this is not a good product practice!
            // This is only for development testing for students.
            // You shall delete in a real environment!
            if (Program.UseInMemory && !MEMORY_RUN)
            {
                Characters?.Add(new Character
                {
                    Name = "Bátor Sándor",
                    Bravery = 30,
                    Presence = 10,
                    Trust = 5,
                    Care = 10,
                    Growth = 5
                });
                Characters?.Add(new Character
                {
                    Name = "Bízom Balázs", 
                    Bravery = 5, 
                    Presence = 10, 
                    Trust = 50,
                    Care = 0,
                    Growth = 15
                });
                Characters?.Add(new Character
                {
                    Name = "Jelen Volt Zsolt", 
                    Bravery = 15, 
                    Presence = 35, 
                    Trust = 20,
                    Care = 10,
                    Growth = 10
                });

                Challenges?.Add(new Challenge { 
                    Title = "Demózás", 
                    GainableBravery = 10,
                    RequiredBravery = 0, 
                    RequiredTrust = 100, 
                    RequiredPresence = 5,
                    RequiredCare = 0,
                    RequiredGrowth = 5
                });
                Challenges?.Add(new Challenge { 
                    Title = "Ügyféllátogatás", 
                    GainableTrust = 3,
                    RequiredBravery = 10, 
                    RequiredTrust = 0, 
                    RequiredPresence = 0,
                    RequiredCare = 0,
                    RequiredGrowth = 0
                });
                Challenges?.Add(new Challenge { 
                    Title = "Mentorálás", 
                    GainableTrust = 1, 
                    GainablePresence = 1,
                    RequiredBravery = 0, 
                    RequiredTrust = 0,
                    RequiredPresence = 5,
                    RequiredCare = 0,
                    RequiredGrowth = 0
                });
                Managements?.Add(new Management
                {
                    CharacterId = 1,
                    ChallangeId = 1,
                    State = "Assigned",
                    Details = "Előre létrehozott megjegyzés."
                });
                
                SaveChangesAsync();
                MEMORY_RUN = true;
            }
        }

        public DbSet<Character> Characters { get; set; }

        public DbSet<Challenge> Challenges { get; set; }

        public DbSet<Management> Managements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Character>().ToTable("character");
            modelBuilder.Entity<Challenge>().ToTable("challenge");
            modelBuilder.Entity<Management>().ToTable("management");
        }

        private static bool MEMORY_RUN = false;
    }
}
