using Microsoft.AspNetCore.Mvc.Rendering;

namespace EvoCharacterManager.Models.ViewModels
{
    public class ChallengePageViewModel
    {
        public int SelectedChallengeId { get; set; }

        public ChallengeViewModel? SelectedChallenge { get; set; }

        public SelectList SelectableChallenges { get; set; } = new SelectList(new List<string>());

        public bool AddChallenge { get; set; }

        public ChallengeViewModel NewChallenge { get; set; } = new ChallengeViewModel();
    }
}
