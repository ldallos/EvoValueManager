using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CharacterController : ControllerBase
    {
        private readonly ICharacterService _characterService;

        public CharacterController(ICharacterService service)
        {
            _characterService = service;
        }

        // GET: api/Character
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CharacterViewModel>>> GetCharacters()
        {
            var characters = await _characterService.GetAllCharacters();
            
            var viewModels = characters.Select(c => new CharacterViewModel
            {
                Id = c.ID,
                Name = c.Name,
                Bravery = c.Bravery,
                Trust = c.Trust,
                Presence = c.Presence,
                Growth = c.Growth,
                Care = c.Care
            }).ToList();

            return Ok(viewModels);
        }

        // GET: api/Character/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CharacterViewModel>> GetCharacter(int id)
        {
            var character = await _characterService.GetCharacterById(id);

            if (character == null)
            {
                return NotFound();
            }
            
            var viewModel = new CharacterViewModel
            {
                Id = character.ID,
                Name = character.Name,
                Bravery = character.Bravery,
                Trust = character.Trust,
                Presence = character.Presence,
                Growth = character.Growth,
                Care = character.Care
            };

            return Ok(viewModel);
        }

        // POST: api/Character
        [HttpPost]
        public async Task<ActionResult<CharacterViewModel>> PostCharacter([FromBody] CharacterViewModel characterViewModel)
        {
            if (string.IsNullOrEmpty(characterViewModel.Name) || characterViewModel.Name.Length < 3)
            {
                return BadRequest("Character name must be at least 3 characters long.");
            }

            var validations = new List<(string PropertyName, int Value, string ErrorMessage)>
            {
                ("Bravery", characterViewModel.Bravery, "Bravery must be between 1 and 100."),
                ("Trust", characterViewModel.Trust, "Trust must be between 1 and 100."),
                ("Presence", characterViewModel.Presence, "Presence must be between 1 and 100."),
                ("Growth", characterViewModel.Growth, "Growth must be between 1 and 100."),
                ("Care", characterViewModel.Care, "Care must be between 1 and 100."),
            };

            foreach (var validation in validations)
            {
                if (validation.Value < 1 || validation.Value > 100)
                {
                    return BadRequest(validation.ErrorMessage);
                }
            }

            var character = new Character
            {
                Name = characterViewModel.Name,
                Bravery = characterViewModel.Bravery,
                Trust = characterViewModel.Trust,
                Presence = characterViewModel.Presence,
                Growth = characterViewModel.Growth,
                Care = characterViewModel.Care
            };

            await _characterService.SaveNewCharacter(character);
            
            var createdViewModel = new CharacterViewModel
            {
                 Id = character.ID,
                 Name = character.Name,
                 Bravery = character.Bravery,
                 Trust = character.Trust,
                 Presence = character.Presence,
                 Growth = character.Growth,
                 Care = character.Care
            };
            
            return CreatedAtAction(nameof(GetCharacter), new { id = character.ID }, createdViewModel);
        }

        // PUT: api/Character/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCharacter(int id, [FromBody] CharacterViewModel characterViewModel)
        {
            if (id != characterViewModel.Id)
            {
                return BadRequest("ID mismatch in route and body.");
            }

            var characterToUpdate = await _characterService.GetCharacterById(id);

            if (characterToUpdate == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(characterViewModel.Name) || characterViewModel.Name.Length < 3) { return BadRequest("Name too short."); }
            if (characterViewModel.Bravery < 1 || characterViewModel.Bravery > 100) { return BadRequest("Invalid Bravery."); }
            if (characterViewModel.Trust < 1 || characterViewModel.Trust > 100) { return BadRequest("Invalid Trust."); }
            if (characterViewModel.Presence < 1 || characterViewModel.Presence > 100) { return BadRequest("Invalid Presence."); }
            if (characterViewModel.Growth < 1 || characterViewModel.Growth > 100) { return BadRequest("Invalid Growth."); }
            if (characterViewModel.Care < 1 || characterViewModel.Care > 100) { return BadRequest("Invalid Care."); }

             
            characterToUpdate.Name = characterViewModel.Name;
            characterToUpdate.Bravery = characterViewModel.Bravery;
            characterToUpdate.Trust = characterViewModel.Trust;
            characterToUpdate.Presence = characterViewModel.Presence;
            characterToUpdate.Growth = characterViewModel.Growth;
            characterToUpdate.Care = characterViewModel.Care;

            await _characterService.SaveChanges();

            return NoContent();
        }
    }
}