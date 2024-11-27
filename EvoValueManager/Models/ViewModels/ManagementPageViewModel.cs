using Microsoft.AspNetCore.Mvc.Rendering;

namespace EvoCharacterManager.Models.ViewModels
{
    public class ManagementPageViewModel
    {
        public enum ChallengeState
        {
            New = 1,        // Új
            InProgress = 2, // Folyamatban
            Completed = 3,  // Befejezett
            Suspended = 4,  // Felfüggesztett
            Cancelled = 5   // Megszakítva
        }

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

        public ChallengeState SelectedStateId { get; set; }

        public SelectList SelectableStates
        {
            get
            {
                return new SelectList(
                    new List<SelectListItem>
                    {
                        new SelectListItem("Új", ((int)ChallengeState.New).ToString()),
                        new SelectListItem("Folyamatban", ((int)ChallengeState.InProgress).ToString()),
                        new SelectListItem("Befejezett", ((int)ChallengeState.Completed).ToString()),
                        new SelectListItem("Felfüggesztett", ((int)ChallengeState.Suspended).ToString()),
                        new SelectListItem("Megszakítva", ((int)ChallengeState.Cancelled).ToString())
                    },
                    "Value",
                    "Text");
            }
        }

        public static string GetStateText(ChallengeState state)
        {
            return state switch
            {
                ChallengeState.New => "Új",
                ChallengeState.InProgress => "Folyamatban",
                ChallengeState.Completed => "Befejezett",
                ChallengeState.Suspended => "Felfüggesztett",
                ChallengeState.Cancelled => "Megszakítva",
                _ => "Új"
            };
        }
    }
}