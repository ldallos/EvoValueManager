using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class Character
    {
        [Column("id")]
        public int ID { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        [Column("title")]
        public string? Title { get; set; }

        [Column("avatar_image")]
        public byte[]? AvatarImage { get; set; }

        [Column("avatar_image_type")]
        public string? AvatarImageType { get; set; }

        [Column("bravery")] public int Bravery { get; set; } = 0;

        [Column("trust")] public int Trust { get; set; } = 0;

        [Column("presence")] public int Presence { get; set; } = 0;

        [Column("growth")] public int Growth { get; set; } = 0;

        [Column("care")] public int Care { get; set; } = 0;
    }
}
