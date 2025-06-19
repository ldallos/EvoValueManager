using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class Tool
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")] 
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        [StringLength(500)]
        public string? Description { get; set; }

        [Column("bravery_bonus")]
        public int? BraveryBonus { get; set; } 

        [Column("trust_bonus")]
        public int? TrustBonus { get; set; }

        [Column("presence_bonus")]
        public int? PresenceBonus { get; set; }

        [Column("growth_bonus")]
        public int? GrowthBonus { get; set; }

        [Column("care_bonus")]
        public int? CareBonus { get; set; }
    }
}