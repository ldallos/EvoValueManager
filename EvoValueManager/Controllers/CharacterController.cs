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
                        Presence = character.Presence
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
            Character character = new Character
            {
                Name = viewModel.NewCharacter.Name,
                Bravery = viewModel.NewCharacter.Bravery,
                Trust = viewModel.NewCharacter.Trust,
                Presence = viewModel.NewCharacter.Presence
            };
            await myService.SaveNewCharacter(character);
            return RedirectToAction("Character", new { selectedCharacterId = viewModel.SelectedCharacterId });
        }

        private readonly ICharacterService myService;
    }
}
