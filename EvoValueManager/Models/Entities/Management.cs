using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class Management
    {
        [Column("id")]
        public int ID { get; set; }

        [Column("character_id")]
        public int CharacterId { get; set; }

        [Column("challange_id")]
        public int ChallangeId { get; set; }

        [Column("state")]
        public string State { get; set; } = string.Empty;
    }
}
