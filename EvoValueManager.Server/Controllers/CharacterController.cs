using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CharacterController : ControllerBase
    {
        private readonly ICharacterService _characterService;
        private readonly ILogger<CharacterController> _logger;
        private readonly CharacterManagerContext _context;

        public CharacterController(ICharacterService service, ILogger<CharacterController> logger, CharacterManagerContext context)
        {
            _characterService = service;
            _logger = logger;
            _context = context;
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
                Title = c.Title,
                HasAvatar = c.AvatarImage != null,
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
            if (character == null) return NotFound();
            var viewModel = new CharacterViewModel
            {
                Id = character.ID,
                Name = character.Name,
                Title = character.Title,
                HasAvatar = character.AvatarImage != null,
                Bravery = character.Bravery,
                Trust = character.Trust,
                Presence = character.Presence,
                Growth = character.Growth,
                Care = character.Care
            };
            return Ok(viewModel);
        }

        // GET: api/Character/5/achievements
        [HttpGet("{id}/achievements")]
        public async Task<ActionResult<IEnumerable<Achievement>>> GetCharacterAchievements(int id)
        {
            var characterExists = await _context.Characters.AnyAsync(c => c.ID == id);
            if (!characterExists)
            {
                return NotFound("Character not found.");
            }

            var achievements = await _context.CharacterAchievements
                .Where(ca => ca.CharacterId == id)
                .Include(ca => ca.Achievement)
                .Select(ca => ca.Achievement!)
                .ToListAsync();

            return Ok(achievements);
        }

        // GET: api/Character/5/avatar
        [HttpGet("{id}/avatar")]
        public async Task<IActionResult> GetCharacterAvatar(int id)
        {
            var character = await _characterService.GetCharacterById(id);
            if (character == null || character.AvatarImage == null || string.IsNullOrEmpty(character.AvatarImageType))
            {
                return NotFound();
            }
            return File(character.AvatarImage, character.AvatarImageType);
        }

        // POST: api/Character
        [HttpPost]
        public async Task<ActionResult<CharacterViewModel>> PostCharacter([FromBody] CharacterViewModel characterViewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var character = new Character
            {
                Name = characterViewModel.Name,
                Title = characterViewModel.Title,
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
                Title = character.Title,
                HasAvatar = character.AvatarImage != null,
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
                 return BadRequest("ID mismatch.");
             }

             var characterToUpdate = await _characterService.GetCharacterById(id);
             if (characterToUpdate == null)
             {
                 return NotFound();
             }
            
             characterToUpdate.Name = characterViewModel.Name;
             characterToUpdate.Title = characterViewModel.Title;
             characterToUpdate.Bravery = characterViewModel.Bravery;
             characterToUpdate.Trust = characterViewModel.Trust;
             characterToUpdate.Presence = characterViewModel.Presence;
             characterToUpdate.Growth = characterViewModel.Growth;
             characterToUpdate.Care = characterViewModel.Care;

             await _characterService.SaveChanges();

             return NoContent();
        }


        // POST: api/Character/5/avatar
        [HttpPost("{id}/avatar")]
        public async Task<IActionResult> UploadCharacterAvatar(int id, IFormFile? file)
        {
            var character = await _characterService.GetCharacterById(id);
            if (character == null) return NotFound(new { message = "Character not found." });
            if (file == null || file.Length == 0) return BadRequest(new { message = "No file uploaded." });
            if (file.Length > 2 * 1024 * 1024) return BadRequest(new { message = "File size exceeds 2MB limit." });
            if (!file.ContentType.StartsWith("image/")) return BadRequest(new { message = "Invalid file type." });

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                character.AvatarImage = memoryStream.ToArray();
                character.AvatarImageType = file.ContentType;
            }
            await _characterService.SaveChanges();
            _logger.LogInformation($"Avatar updated for character ID {id}");
            return Ok(new { message = "Avatar updated successfully." });
        }
    }
}