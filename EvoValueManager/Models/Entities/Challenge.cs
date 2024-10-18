using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class Challenge
    {
        [Column("id")]
        public int ID { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("required_bravery")]
        public int? RequiredBravery { get; set; }

        [Column("required_trust")]
        public int? RequiredTrust { get; set; }

        [Column("required_presence")]
        public int? RequiredPresence { get; set; }
        
        [Column("required_growth")]
        public int? RequiredGrowth { get; set; }
        
        [Column("required_care")]
        public int? RequiredCare { get; set; }

        [Column("gainable_bravery")]
        public int? GainableBravery { get; set; }

        [Column("gainable_trust")]
        public int? GainableTrust { get; set; }

        [Column("gainable_presence")]
        public int? GainablePresence { get; set; }
        
        [Column("gainable_growth")]
        public int? GainableGrowth { get; set; }
        
        [Column("gainable_care")]
        public int? GainableCare { get; set; }
    }
}
