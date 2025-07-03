using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class CharacterAchievement
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("character_id")]
        public int CharacterId { get; set; }
        public Character? Character { get; set; }

        [Column("achievement_id")]
        public int AchievementId { get; set; }
        public Achievement? Achievement { get; set; }

        [Column("earned_at")]
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
    }
}