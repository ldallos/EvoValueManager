namespace EvoCharacterManager.Models.ViewModels
{
    public class ToolViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; 
        public string? Description { get; set; }
        public int? BraveryBonus { get; set; }
        public int? TrustBonus { get; set; }
        public int? PresenceBonus { get; set; }
        public int? GrowthBonus { get; set; }
        public int? CareBonus { get; set; }
    }
}