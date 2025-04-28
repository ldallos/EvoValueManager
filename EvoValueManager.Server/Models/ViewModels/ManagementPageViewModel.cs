using Microsoft.AspNetCore.Mvc.Rendering;
using EvoValueManager.Models.Shared;

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
        
        public string? Details { get; set; }

        public int SelectedStateId { get; set; }

        public SelectList SelectableStates
        {
            get
            {
                return new SelectList(
                    new List<SelectListItem>
                    {
                        new SelectListItem(Resources.ChallengeState_New, "1"),
                        new SelectListItem(Resources.ChallengeState_InProgress, "2"),
                        new SelectListItem(Resources.ChallengeState_Completed, "3"),
                        new SelectListItem(Resources.ChallengeState_Suspended, "4"),
                        new SelectListItem(Resources.ChallengeState_Cancelled, "5")
                    },
                    "Value",
                    "Text");
            }
        }

        public static string GetStateText(int stateId)
        {
            return stateId switch
            {
                1 => Resources.ChallengeState_New,
                2 => Resources.ChallengeState_InProgress,
                3 => Resources.ChallengeState_Completed,
                4 => Resources.ChallengeState_Suspended,
                5 => Resources.ChallengeState_Cancelled,
                _ => Resources.ChallengeState_New
            };
        }
    }
}