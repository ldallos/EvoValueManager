using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class Character
    {
        [Column("id")]
        public int ID { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("bravery")] public int Bravery { get; set; } = 0;

        [Column("trust")] public int Trust { get; set; } = 0;

        [Column("presence")] public int Presence { get; set; } = 0;

        [Column("growth")] public int Growth { get; set; } = 0;

        [Column("care")] public int Care { get; set; } = 0;
    }
}
