namespace EvoCharacterManager.Models.ViewModels
{
    public class AchievementViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconType { get; set; } = string.Empty;
    }
}