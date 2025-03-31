using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/characters")]
    public class NewCharacterController : ControllerBase
    {
        private readonly ICharacterService _characterService;

        public NewCharacterController(ICharacterService characterService)
        {
            _characterService = characterService;
        }

        /// <summary>
        /// Visszaadja az összes karaktert
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CharacterViewModel>>> GetCharacters()
        {
            var characters = await _characterService.GetAllCharacters();
            var characterViewModels = characters.Select(c => new CharacterViewModel
            {
                Id = c.ID,
                Name = c.Name
            }).ToList();

            return Ok(characterViewModels);
        }

        /// <summary>
        /// Visszaad egy adott karaktert az ID alapján
        /// </summary>
        [HttpGet("asd")]
        public async Task<ActionResult<CharacterViewModel>> GetCharacterById(int id)
        {
            var character = await _characterService.GetCharacterById(id);
            if (character == null)
            {
                return NotFound();
            }

            var characterViewModel = new CharacterViewModel
            {
                Id = character.ID,
                Name = character.Name,
                Bravery = character.Bravery,
                Trust = character.Trust,
                Presence = character.Presence,
                Growth = character.Growth,
                Care = character.Care
            };

            return Ok(characterViewModel);
        }

        /// <summary>
        /// Új karakter létrehozása
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CharacterViewModel>> CreateCharacter([FromBody] CharacterViewModel viewModel)
        {
            if (string.IsNullOrEmpty(viewModel.Name) || viewModel.Name.Length < 3)
            {
                return BadRequest("A karakter nevének legalább 3 karakter hosszúnak kell lennie!");
            }

            var validations = new List<(string PropertyName, int Value, string ErrorMessage)>
            {
                ("Bravery", viewModel.Bravery, "A karakter merészségének 1 és 100 közötti értéket lehet megadni"),
                ("Trust", viewModel.Trust, "A karakter megbízhatóságának 1 és 100 közötti értéket lehet megadni"),
                ("Presence", viewModel.Presence, "A karakter jelenlétének 1 és 100 közötti értéket lehet megadni"),
                ("Growth", viewModel.Growth, "A karakter fejlődésének 1 és 100 közötti értéket lehet megadni"),
                ("Care", viewModel.Care, "A karakter gondoskodásának 1 és 100 közötti értéket lehet megadni"),
            };

            foreach (var validation in validations)
            {
                if (validation.Value < 1 || validation.Value > 100)
                {
                    return BadRequest(validation.ErrorMessage);
                }
            }

            var newCharacter = new Character
            {
                Name = viewModel.Name,
                Bravery = viewModel.Bravery,
                Trust = viewModel.Trust,
                Presence = viewModel.Presence,
                Growth = viewModel.Growth,
                Care = viewModel.Care
            };

            await _characterService.SaveNewCharacter(newCharacter);

            return CreatedAtAction(nameof(GetCharacterById), new { id = newCharacter.ID }, viewModel);
        }

        /// <summary>
        /// Meglévő karakter módosítása
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCharacter(int id, [FromBody] CharacterViewModel viewModel)
        {
            var character = await _characterService.GetCharacterById(id);
            if (character == null)
            {
                return NotFound();
            }

            character.Name = viewModel.Name;
            character.Bravery = viewModel.Bravery;
            character.Trust = viewModel.Trust;
            character.Presence = viewModel.Presence;
            character.Growth = viewModel.Growth;
            character.Care = viewModel.Care;

            await _characterService.SaveChanges();

            return NoContent();
        }
    }
}
