using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class Management
    {
        [Column("id")]
        public int ID { get; set; }

        [Column("character_id")]
        public int CharacterId { get; set; }

        [Column("challenge_id")]
        public int ChallengeId { get; set; }

        [Column("state_id")]
        public int StateId { get; set; }

        [Column("details")]
        public string? Details { get; set; }

        public bool IsClosed { get; set; }
    }
}
