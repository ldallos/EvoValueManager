using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Data
{
    public class CharacterManagerContext : DbContext
    {
        public CharacterManagerContext(DbContextOptions<CharacterManagerContext> options) : base(options)
        {
        }

        public DbSet<Character> Characters { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<Management> Managements { get; set; }
        public DbSet<Tool> Tools { get; set; }
        public DbSet<CharacterTool> CharacterTools { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<CharacterAchievement> CharacterAchievements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Character>().ToTable("character");
            modelBuilder.Entity<Challenge>().ToTable("challenge");
            modelBuilder.Entity<Management>().ToTable("management");
            modelBuilder.Entity<Tool>().ToTable("tool");
            modelBuilder.Entity<CharacterTool>().ToTable("character_tool");
            modelBuilder.Entity<Achievement>().ToTable("achievement");
            modelBuilder.Entity<CharacterAchievement>().ToTable("character_achievement");

            modelBuilder.Entity<Management>()
                .HasOne<Character>()
                .WithMany()
                .HasForeignKey(m => m.CharacterId)
                .OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<CharacterTool>()
                .HasOne(ct => ct.Character)
                .WithMany()
                .HasForeignKey(ct => ct.CharacterId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CharacterTool>()
                .HasOne(ct => ct.Tool)
                .WithMany()
                .HasForeignKey(ct => ct.ToolId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CharacterTool>()
                .HasIndex(ct => new { ct.CharacterId, ct.ToolId })
                .IsUnique();
            modelBuilder.Entity<CharacterAchievement>()
                .HasOne(ca => ca.Character)
                .WithMany()
                .HasForeignKey(ca => ca.CharacterId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CharacterAchievement>()
                .HasOne(ca => ca.Achievement)
                .WithMany()
                .HasForeignKey(ca => ca.AchievementId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CharacterAchievement>()
                .HasIndex(ca => new { ca.CharacterId, ca.AchievementId })
                .IsUnique();
        }
    }
}