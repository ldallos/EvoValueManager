namespace EvoCharacterManager.Models.ViewModels
{
    public class StatDetailViewModel
    {
        public int Base { get; set; }
        public int Bonus { get; set; }
        public int Effective => Base + Bonus;
    }

    public class RichCharacterViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Title { get; set; }
        public bool HasAvatar { get; set; }

        public StatDetailViewModel Bravery { get; set; } = new();
        public StatDetailViewModel Trust { get; set; } = new();
        public StatDetailViewModel Presence { get; set; } = new();
        public StatDetailViewModel Growth { get; set; } = new();
        public StatDetailViewModel Care { get; set; } = new();

        public List<ToolViewModel> AppliedTools { get; set; } = new();
        
        public List<AchievementViewModel> Achievements { get; set; } = new();
    }
}