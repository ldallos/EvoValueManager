using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using EvoValueManager.Models.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Controllers
{
    public class AssignChallengePayload
    {
        public int CharacterId { get; set; }
        public int ChallengeId { get; set; }
        public int StateId { get; set; }
        public string? Details { get; set; }
    }

    public class UpdateManagementPayload
    {
        public int StateId { get; set; }
        public string? Details { get; set; }
    }

    public class ManagementDetailsViewModel
    {
        public string State { get; set; } = string.Empty;
        public string? Details { get; set; }
        public bool IsClosed { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ManagementController : ControllerBase
    {
        private readonly IManagementService _managementService;
        private readonly ICharacterService _characterService;
        private readonly IChallengeService _challengeService;

        public ManagementController(
            IManagementService managementService,
            ICharacterService characterService,
            IChallengeService challengeService)
        {
            _managementService = managementService;
            _characterService = characterService;
            _challengeService = challengeService;
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
            var assignedChallenges = await _managementService.GetAssignedChallenges(characterId);
            var closedChallenges = await _managementService.GetClosedChallenges(characterId);

            var assignedOrClosedIds = assignedChallenges.Select(c => c.ID)
                .Union(closedChallenges.Select(c => c.ID))
                .ToHashSet();

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
            var character = await _characterService.GetCharacterById(characterId);
            if (character == null) return NotFound("Character not found.");

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
                State = management.State,
                Details = management.Details,
                IsClosed = management.IsClosed
            };

            return Ok(detailsViewModel);
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


            var insufficientStats = new List<string>();
            if (!IsStatSufficient(character.Growth, challenge.RequiredGrowth))
                insufficientStats.Add(Resources.Value_Growth);
            if (!IsStatSufficient(character.Care, challenge.RequiredCare)) insufficientStats.Add(Resources.Value_Care);
            if (!IsStatSufficient(character.Presence, challenge.RequiredPresence))
                insufficientStats.Add(Resources.Value_Presence);
            if (!IsStatSufficient(character.Bravery, challenge.RequiredBravery))
                insufficientStats.Add(Resources.Value_Bravery);
            if (!IsStatSufficient(character.Trust, challenge.RequiredTrust))
                insufficientStats.Add(Resources.Value_Trust);

            if (insufficientStats.Count > 0)
            {
                return BadRequest($"Insufficient stats: {string.Join(", ", insufficientStats).ToLower()}.");
            }

            try
            {
                string stateText = GetStateTextFromId(payload.StateId);
                await _managementService.AssignChallenge(payload.CharacterId, payload.ChallengeId, payload.StateId,
                    payload.Details);

                await _managementService.SaveChanges();

                return Ok(new { message = "Challenge assigned successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while assigning the challenge.");
            }
        }


        // PUT: api/Management/{characterId}/{challengeId}
        [HttpPut("{characterId}/{challengeId}")]
        public async Task<IActionResult> UpdateAssignment(int characterId, int challengeId,
            [FromBody] UpdateManagementPayload payload)
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
                string newStateText = GetStateTextFromId(payload.StateId);
                await _managementService.UpdateState(characterId, challengeId, newStateText);
                await _managementService.UpdateManagementDetails(characterId, challengeId, payload.Details);

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
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

            string completedStateText = GetStateTextFromId(3);
            if (management.State != completedStateText)
            {
                return BadRequest($"Challenge must be in '{completedStateText}' state to close and gain stats.");
            }

            try
            {
                character.Bravery += challenge.GainableBravery ?? 0;
                character.Trust += challenge.GainableTrust ?? 0;
                character.Presence += challenge.GainablePresence ?? 0;
                character.Growth += challenge.GainableGrowth ?? 0;
                character.Care += challenge.GainableCare ?? 0;

                management.IsClosed = true;

                await _managementService.SaveChanges();

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

        private bool IsStatSufficient(int characterStat, int? requiredStat)
        {
            return requiredStat == null || characterStat >= requiredStat.Value;
        }
    }
}