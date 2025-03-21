using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace EvoCharacterManager.Controllers
{
    public class CharacterController : Controller
    {
        public CharacterController(ICharacterService service)
        {
            myService = service;
        }

        public async Task<IActionResult> Character(int? selectedCharacterId, bool? addCharacter)
        {
            var characters = await myService.GetAllCharacters();

            var characterViewModels = characters.Select(c => new CharacterViewModel
            {
                Name = c.Name,
                Id = c.ID,
            }).ToList();

            CharacterViewModel? selectedCharacter = null;
            if (selectedCharacterId.HasValue)
            {
                var character = await myService.GetCharacterById(selectedCharacterId.Value);
                if (character != null)
                {
                    selectedCharacter = new CharacterViewModel
                    {
                        Id = character.ID,
                        Name = character.Name,
                        Bravery = character.Bravery,
                        Trust = character.Trust,
                        Presence = character.Presence,
                        Growth = character.Growth,
                        Care = character.Care
                    };
                }
            }

            var viewModel = new CharacterPageViewModel
            {
                SelectedCharacterId = selectedCharacterId ?? 0,
                SelectedCharacter = selectedCharacter,
                SelectableCharacters = new SelectList(characterViewModels, "Id", "Name"),
                AddCharacter = addCharacter ?? false
            };

            return View(viewModel);
        }

        [HttpPost]
        public IActionResult CharacterSelection(CharacterPageViewModel viewModel)
        {
            return RedirectToAction(
                "Character",
                new
                {
                    selectedCharacterId = viewModel.SelectedCharacterId,
                    addCharacter = viewModel.AddCharacter
                });
        }

        [HttpPost]
        public IActionResult AddCharacter(CharacterPageViewModel viewModel)
        {
            return RedirectToAction(
                "Character",
                new
                {
                    selectedCharacterId = viewModel.SelectedCharacterId,
                    addCharacter = !viewModel.AddCharacter
                });
        }

        [HttpPost]
        public async Task<IActionResult> SaveNewCharacter(CharacterPageViewModel viewModel)
        {
            if (string.IsNullOrEmpty(viewModel.NewCharacter?.Name) || viewModel.NewCharacter.Name.Length < 3)
            {
                TempData["ErrorMessage"] = "A karakter nevének legalább 3 karakter hosszúnak kell lennie!";
                return RedirectToAction("Character", new
                {
                    selectedCharacterId = viewModel.SelectedCharacterId,
                    addCharacter = true
                });
            }

            var validations = new List<(string PropertyName, int Value, string ErrorMessage)>
            {
                ("Bravery", viewModel.NewCharacter.Bravery, "A karakter merészségének 1 és 100 közötti értéket lehet megadni"),
                ("Trust", viewModel.NewCharacter.Trust, "A karakter megbízhatóságának 1 és 100 közötti értéket lehet megadni"),
                ("Presence", viewModel.NewCharacter.Presence, "A karakter jelenlétének 1 és 100 közötti értéket lehet megadni"),
                ("Growth", viewModel.NewCharacter.Growth, "A karakter fejlődésének 1 és 100 közötti értéket lehet megadni"),
                ("Care", viewModel.NewCharacter.Care, "A karakter gondoskodásának 1 és 100 közötti értéket lehet megadni"),
            };

            foreach (var validation in validations)
            {
                if (validation.Value < 1 || validation.Value > 100)
                {
                    TempData["ErrorMessage"] = validation.ErrorMessage;
                    return RedirectToAction("Character", new
                    {
                        selectedCharacterId = viewModel.SelectedCharacterId,
                        addCharacter = true
                    });
                }
            }

            Character character = new Character
            {
                Name = viewModel.NewCharacter.Name,
                Bravery = viewModel.NewCharacter.Bravery,
                Trust = viewModel.NewCharacter.Trust,
                Presence = viewModel.NewCharacter.Presence,
                Growth = viewModel.NewCharacter.Growth,
                Care = viewModel.NewCharacter.Care
            };
            await myService.SaveNewCharacter(character);
            return RedirectToAction("Character", new { selectedCharacterId = viewModel.SelectedCharacterId });
        }

        private readonly ICharacterService myService;

        
        [HttpPost]
        public async Task<IActionResult> SaveCharacterChange(CharacterPageViewModel viewModel)
        {
            var character = await myService.GetCharacterById(viewModel.SelectedCharacterId);
            if (character != null && viewModel.SelectedCharacter != null)
            {
                character.Name = viewModel.SelectedCharacter.Name;
                character.Bravery = viewModel.SelectedCharacter.Bravery;
                character.Trust = viewModel.SelectedCharacter.Trust;
                character.Presence = viewModel.SelectedCharacter.Presence;
                character.Growth = viewModel.SelectedCharacter.Growth;
                character.Care = viewModel.SelectedCharacter.Care;

                await myService.SaveChanges();
            }

            return RedirectToAction("Character", new { selectedCharacterId = viewModel.SelectedCharacterId });
        }
    }
}
