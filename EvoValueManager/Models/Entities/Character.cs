using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class Character
    {
        [Column("id")]
        public int ID { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("bravery")]
        public int Bravery { get; set; }

        [Column("trust")]
        public int Trust { get; set; }

        [Column("presence")]
        public int Presence { get; set; }
    }
}
