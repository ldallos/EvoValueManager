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

        public CharacterController(ICharacterService service, ILogger<CharacterController> logger,
            CharacterManagerContext context)
        {
            _characterService = service;
            _logger = logger;
            _context = context;
        }

        // GET: api/Character
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RichCharacterViewModel>>> GetCharacters()
        {
            var characters = await _context.Characters
                .AsNoTracking()
                .Include(c => c.CharacterTools)
                .ThenInclude(ct => ct.Tool)
                .Include(c => c.CharacterAchievements)
                .ThenInclude(ca => ca.Achievement)
                .ToListAsync();

            var viewModels = characters.Select(character =>
            {
                var appliedTools = character.CharacterTools.Select(ct => ct.Tool!).ToList();
                var earnedAchievements = character.CharacterAchievements.Select(ca => ca.Achievement!).ToList();

                return new RichCharacterViewModel
                {
                    Id = character.ID,
                    Name = character.Name,
                    Title = character.Title,
                    HasAvatar = character.AvatarImage != null,

                    Bravery = new StatDetailViewModel
                        { Base = character.Bravery, Bonus = appliedTools.Sum(t => t.BraveryBonus ?? 0) },
                    Trust = new StatDetailViewModel
                        { Base = character.Trust, Bonus = appliedTools.Sum(t => t.TrustBonus ?? 0) },
                    Presence = new StatDetailViewModel
                        { Base = character.Presence, Bonus = appliedTools.Sum(t => t.PresenceBonus ?? 0) },
                    Growth = new StatDetailViewModel
                        { Base = character.Growth, Bonus = appliedTools.Sum(t => t.GrowthBonus ?? 0) },
                    Care = new StatDetailViewModel
                        { Base = character.Care, Bonus = appliedTools.Sum(t => t.CareBonus ?? 0) },

                    AppliedTools = appliedTools.Select(t => new ToolViewModel
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Description = t.Description,
                        BraveryBonus = t.BraveryBonus,
                        TrustBonus = t.TrustBonus,
                        PresenceBonus = t.PresenceBonus,
                        GrowthBonus = t.GrowthBonus,
                        CareBonus = t.CareBonus
                    }).ToList(),

                    Achievements = earnedAchievements.Select(ach => new AchievementViewModel
                    {
                        Id = ach.Id,
                        Name = ach.Name,
                        Description = ach.Description,
                        IconType = ach.IconType
                    }).ToList()
                };
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
        public async Task<ActionResult<CharacterViewModel>> PostCharacter(
            [FromBody] CharacterViewModel characterViewModel)
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
        public async Task<ActionResult<CharacterViewModel>> PutCharacter
            (int id, [FromBody] CharacterViewModel characterViewModel)
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

            var updatedViewModel = new CharacterViewModel
            {
                Id = characterToUpdate.ID,
                Name = characterToUpdate.Name,
                Title = characterToUpdate.Title,
                HasAvatar = characterToUpdate.AvatarImage != null,
                Bravery = characterToUpdate.Bravery,
                Trust = characterToUpdate.Trust,
                Presence = characterToUpdate.Presence,
                Growth = characterToUpdate.Growth,
                Care = characterToUpdate.Care
            };

            return Ok(updatedViewModel);
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

        // DELETE: api/Character/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCharacter(int id)
        {
            var character = await _characterService.GetCharacterById(id);
            if (character == null)
            {
                return NotFound();
            }

            await _characterService.DeleteCharacterAsync(id);
            return NoContent();
        }
    }
}