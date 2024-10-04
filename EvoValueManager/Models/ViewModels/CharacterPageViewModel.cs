using Microsoft.AspNetCore.Mvc.Rendering;

namespace EvoCharacterManager.Models.ViewModels
{
    public class CharacterPageViewModel
    {
        public int SelectedCharacterId { get; set; }

        public CharacterViewModel? SelectedCharacter { get; set; }

        public SelectList SelectableCharacters { get; set; } = new SelectList(new List<string>());

        public bool AddCharacter { get; set; }

        public CharacterViewModel NewCharacter { get; set; } = new CharacterViewModel { Bravery = 1, Presence = 1, Trust = 1 };
    }
}
