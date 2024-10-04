namespace EvoCharacterManager.Models.ViewModels
{
    public class ChallengeViewModel
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int? RequiredBravery { get; set; }

        public int? RequiredTrust { get; set; }

        public int? RequiredPresence { get; set; }

        public int? GainableBravery { get; set; }

        public int? GainableTrust { get; set; }

        public int? GainablePresence { get; set; }
    }
}
