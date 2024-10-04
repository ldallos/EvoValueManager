using Microsoft.AspNetCore.Mvc.Rendering;

namespace EvoCharacterManager.Models.ViewModels
{
    public class ManagementPageViewModel
    {
        public int SelectedAssignedId { get; set; }

        public SelectList SelectableAssignedValues
        {
            get
            {
                return new SelectList(
                    new List<SelectListItem>
                    {
                        new SelectListItem("Új kihívás", "1"),
                        new SelectListItem("Kihívás kezelés", "2"),
                    },
                    "Value",
                    "Text");
            }
        }

        public int SelectedCharacterId { get; set; }

        public int SelectedChallengeId { get; set; }

        public SelectList SelectableCharacters { get; set; } = new SelectList(new List<string>());

        public SelectList? SelectableChallenges { get; set; }

        public CharacterViewModel? SelectedCharacter { get; set; }

        public ChallengeViewModel? SelectedChallenge { get; set; }
    }
}
