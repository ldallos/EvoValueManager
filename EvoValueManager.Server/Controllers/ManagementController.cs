using EvoCharacterManager.Data;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using EvoValueManager.Models.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EvoCharacterManager.Dto;
using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ManagementController : ControllerBase
    {
        private readonly IManagementService _managementService;
        private readonly ICharacterService _characterService;
        private readonly IChallengeService _challengeService;
        private readonly CharacterManagerContext  _context;
        private readonly ICharacterToolService _characterToolService;

        public ManagementController(
            IManagementService managementService,
            ICharacterService characterService,
            IChallengeService challengeService,
            CharacterManagerContext context,
            ICharacterToolService characterToolService)
        {
            _managementService = managementService;
            _characterService = characterService;
            _challengeService = challengeService;
            _context = context;
            _characterToolService = characterToolService;
        }

        private string GetStateTextFromId(int stateId)
        {
            return stateId switch
            {
                1 => Resources.ChallengeState_New, // "Új"
                2 => Resources.ChallengeState_InProgress, // "Folyamatban"
                3 => Resources.ChallengeState_Completed, // "Befejezett"
                4 => Resources.ChallengeState_Suspended, // "Felfüggesztett"
                5 => Resources.ChallengeState_Cancelled, // "Megszakított"
                _ => Resources.ChallengeState_New // Default to "Új"
            };
        }

        // GET: api/Management/available/{characterId}
        [HttpGet("available/{characterId}")]
        public async Task<ActionResult<IEnumerable<ChallengeViewModel>>> GetAvailableChallenges(int characterId)
        {
            var character = await _characterService.GetCharacterById(characterId);
            if (character == null) return NotFound("Character not found.");

            var allChallenges = await _challengeService.GetAllChallenges();
            var assignedOrClosedIds = await _context.Managements
                .Where(m => m.CharacterId == characterId)
                .Select(m => m.ChallengeId)
                .ToHashSetAsync();

            var available = allChallenges
                .Where(c => !assignedOrClosedIds.Contains(c.ID))
                .Select(c => new ChallengeViewModel
                {
                    Id = c.ID,
                    Title = c.Title,
                    RequiredBravery = c.RequiredBravery,
                    RequiredTrust = c.RequiredTrust,
                    RequiredPresence = c.RequiredPresence,
                    RequiredGrowth = c.RequiredGrowth,
                    RequiredCare = c.RequiredCare,
                    GainableBravery = c.GainableBravery,
                    GainableTrust = c.GainableTrust,
                    GainablePresence = c.GainablePresence,
                    GainableGrowth = c.GainableGrowth,
                    GainableCare = c.GainableCare
                })
                .ToList();

            return Ok(available);
        }

        // GET: api/Management/assigned/{characterId}
        [HttpGet("assigned/{characterId}")]
        public async Task<ActionResult<IEnumerable<ChallengeViewModel>>> GetAssignedChallenges(int characterId)
        {
            var assigned = await _managementService.GetAssignedChallenges(characterId);

            var viewModels = assigned.Select(c => new ChallengeViewModel
            {
                Id = c.ID,
                Title = c.Title,
                RequiredBravery = c.RequiredBravery,
                RequiredTrust = c.RequiredTrust,
                RequiredPresence = c.RequiredPresence,
                RequiredGrowth = c.RequiredGrowth,
                RequiredCare = c.RequiredCare,
                GainableBravery = c.GainableBravery,
                GainableTrust = c.GainableTrust,
                GainablePresence = c.GainablePresence,
                GainableGrowth = c.GainableGrowth,
                GainableCare = c.GainableCare
            }).ToList();

            return Ok(viewModels);
        }

        // GET: api/Management/{characterId}/{challengeId}
        [HttpGet("{characterId}/{challengeId}")]
        public async Task<ActionResult<ManagementDetailsViewModel>> GetAssignmentDetails(int characterId,
            int challengeId)
        {
            var management = await _managementService.GetManagement(characterId, challengeId);
            if (management == null)
            {
                return NotFound("Assignment not found.");
            }

            var detailsViewModel = new ManagementDetailsViewModel
            {
                StateId = management.StateId,
                State = GetStateTextFromId(management.StateId),
                Details = management.Details,
                IsClosed = management.IsClosed
            };

            return Ok(detailsViewModel);
        }
        
        [HttpGet("states")]
        public ActionResult<IEnumerable<ChallengeStateDto>> GetChallengeStates()
        {
            var states = new List<ChallengeStateDto>
            {
                new() { Id = 1, Name = Resources.ChallengeState_New },
                new() { Id = 2, Name = Resources.ChallengeState_InProgress },
                new() { Id = 3, Name = Resources.ChallengeState_Completed },
                new() { Id = 4, Name = Resources.ChallengeState_Suspended },
                new() { Id = 5, Name = Resources.ChallengeState_Cancelled },
            };
            return Ok(states);
        }

        // POST: api/Management
        [HttpPost]
        public async Task<IActionResult> AssignChallengeToCharacter([FromBody] AssignChallengePayload payload)
        {
            var character = await _characterService.GetCharacterById(payload.CharacterId);
            var challenge = await _challengeService.GetChallengeById(payload.ChallengeId);

            if (character == null || challenge == null)
            {
                return BadRequest("Invalid Character or Challenge ID.");
            }

            var existingManagement = await _managementService.GetManagement(payload.CharacterId, payload.ChallengeId);
            if (existingManagement != null && !existingManagement.IsClosed)
            {
                return BadRequest("Challenge is already assigned to this character.");
            }

            if (existingManagement != null && existingManagement.IsClosed)
            {
                return BadRequest("This challenge was previously completed/closed by this character.");
            }

            var assignedTools = await _characterToolService.GetAssignedToolsForCharacterAsync(character.ID);

            var effectiveBravery = 
                character.Bravery + assignedTools.Sum(t => t.BraveryBonus ?? 0);
            var effectiveTrust = 
                character.Trust + assignedTools.Sum(t => t.TrustBonus ?? 0);
            var effectivePresence = 
                character.Presence + assignedTools.Sum(t => t.PresenceBonus ?? 0);
            var effectiveGrowth = 
                character.Growth + assignedTools.Sum(t => t.GrowthBonus ?? 0);
            var effectiveCare = 
                character.Care + assignedTools.Sum(t => t.CareBonus ?? 0);
    
            var insufficientStats = new List<string>();
    
            if (!IsStatSufficient(effectiveGrowth, challenge.RequiredGrowth))
                insufficientStats.Add(Resources.Value_Growth);
            if (!IsStatSufficient(effectiveCare, challenge.RequiredCare)) 
                insufficientStats.Add(Resources.Value_Care);
            if (!IsStatSufficient(effectivePresence, challenge.RequiredPresence))
                insufficientStats.Add(Resources.Value_Presence);
            if (!IsStatSufficient(effectiveBravery, challenge.RequiredBravery))
                insufficientStats.Add(Resources.Value_Bravery);
            if (!IsStatSufficient(effectiveTrust, challenge.RequiredTrust))
                insufficientStats.Add(Resources.Value_Trust);

            if (insufficientStats.Count > 0)
            {
                return BadRequest($"Insufficient stats: {string.Join(", ", insufficientStats).ToLower()}.");
            }

            try
            {
                await _managementService.AssignChallenge(payload.CharacterId, payload.ChallengeId, payload.StateId,
                    payload.Details);

                return Ok(new { message = "Challenge assigned successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while assigning the challenge." });
            }
        }


        // PUT: api/Management/{characterId}/{challengeId}
        [HttpPut("{characterId}/{challengeId}")]
        public async Task<IActionResult> UpdateAssignment(int characterId, int challengeId, [FromBody] UpdateManagementPayload payload)
        {
            var management = await _managementService.GetManagement(characterId, challengeId);
            if (management == null)
            {
                return NotFound("Assignment not found.");
            }

            if (management.IsClosed)
            {
                return BadRequest("Cannot update a closed challenge assignment.");
            }

            try
            {
                await _managementService.UpdateManagement(characterId, challengeId, payload.StateId, payload.Details);

                return NoContent();
            }
            catch (Exception ex)
            { 
                return StatusCode(500, "An error occurred while updating the assignment.");
            }
        }

        // POST: api/Management/close/{characterId}/{challengeId}
        [HttpPost("close/{characterId}/{challengeId}")]
        public async Task<IActionResult> CloseAssignedChallenge(int characterId, int challengeId)
        {
            var character = await _characterService.GetCharacterById(characterId);
            var challenge = await _challengeService.GetChallengeById(challengeId);
            var management = await _managementService.GetManagement(characterId, challengeId);

            if (character == null || challenge == null || management == null)
            {
                return NotFound("Character, Challenge, or Assignment not found.");
            }

            if (management.IsClosed)
            {
                return BadRequest("Challenge assignment is already closed.");
            }

            if (management.StateId != 3)
            {
                return BadRequest($"Challenge must be in '{Resources.ChallengeState_Completed}' state to close and gain stats.");
            }

            try
            {
                character.Bravery = Math.Min(100, character.Bravery + (challenge.GainableBravery ?? 0));
                character.Trust = Math.Min(100, character.Trust + (challenge.GainableTrust ?? 0));
                character.Presence = Math.Min(100, character.Presence + (challenge.GainablePresence ?? 0));
                character.Growth = Math.Min(100, character.Growth + (challenge.GainableGrowth ?? 0));
                character.Care = Math.Min(100, character.Care + (challenge.GainableCare ?? 0));

                management.IsClosed = true;

                await GrantAchievements(character);
    
                await _context.SaveChangesAsync();

                var updatedCharacterViewModel = new CharacterViewModel
                {
                    Id = character.ID,
                    Name = character.Name,
                    Bravery = character.Bravery,
                    Trust = character.Trust,
                    Presence = character.Presence,
                    Growth = character.Growth,
                    Care = character.Care
                };

                return Ok(updatedCharacterViewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while closing the challenge.");
            }
        }

        private async Task GrantAchievements(Character character)
        {
            var earnedAchievementIds = await _context.CharacterAchievements
                .Where(ca => ca.CharacterId == character.ID)
                .Select(ca => ca.AchievementId)
                .ToListAsync();

            var allAchievements = await _context.Achievements.ToListAsync();

            var firstChallenge = allAchievements.FirstOrDefault(a => a.Name == "First Challenge");
            if (firstChallenge != null && !earnedAchievementIds.Contains(firstChallenge.Id))
            {
                _context.CharacterAchievements.Add(new CharacterAchievement
                    { CharacterId = character.ID, AchievementId = firstChallenge.Id });
            }
            
            var braveryAch = allAchievements.FirstOrDefault(a => a.Name == "Bravery Initiate");
            if (braveryAch != null && !earnedAchievementIds.Contains(braveryAch.Id) && character.Bravery >= 50)
            {
                _context.CharacterAchievements.Add(
                    new CharacterAchievement
                    {
                        CharacterId = character.ID, 
                        AchievementId = braveryAch.Id
                    });
            }
            
            var growthAch = allAchievements.FirstOrDefault(a => a.Name == "Growth Adept");
            if (growthAch != null && !earnedAchievementIds.Contains(growthAch.Id) && character.Growth >= 50)
            {
                _context.CharacterAchievements.Add(
                    new CharacterAchievement
                    {
                        CharacterId = character.ID, 
                        AchievementId = growthAch.Id
                    });
            }
            
            var teamPillarAch = allAchievements.FirstOrDefault(a => a.Name == "Team Pillar");
            if (teamPillarAch != null && !earnedAchievementIds.Contains(teamPillarAch.Id) && character.Trust >= 50)
            {
                _context.CharacterAchievements.Add(
                    new CharacterAchievement
                    {
                        CharacterId = character.ID, 
                        AchievementId = teamPillarAch.Id
                    });
            }
        }

        private bool IsStatSufficient(int characterStat, int? requiredStat)
        {
            return requiredStat == null || characterStat >= requiredStat.Value;
        }
    }
}