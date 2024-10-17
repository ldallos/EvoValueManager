namespace EvoCharacterManager.Models.ViewModels
{
    public class ChallengeViewModel
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int? RequiredBravery { get; set; } = 0;

        public int? RequiredTrust { get; set; } = 0;

        public int? RequiredPresence { get; set; } = 0;

        public int? RequiredGrowth { get; set; } = 0;

        public int? RequiredCare { get; set; } = 0;

        public int? GainableBravery { get; set; } = 0;

        public int? GainableTrust { get; set; } = 0;

        public int? GainablePresence { get; set; } = 0;

        public int? GainableGrowth { get; set; } = 0;

        public int? GainableCare { get; set; } = 0;
    }
}