using System.ComponentModel.DataAnnotations.Schema;

namespace EvoCharacterManager.Models.Entities
{
    public class CharacterTool
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("character_id")]
        public int CharacterId { get; set; }
        public Character? Character { get; set; } 

        [Column("tool_id")]
        public int ToolId { get; set; }
        public Tool? Tool { get; set; } 
    }
}