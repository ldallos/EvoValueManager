using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels; // Reusing where appropriate
using EvoCharacterManager.Services;
using EvoValueManager.Models.Shared; // For Resources if needed, or move helper
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // For DbUpdateConcurrencyException
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EvoCharacterManager.Controllers
{
    // --- DTOs specific to Management API ---

    // Payload for assigning a challenge
    public class AssignChallengePayload
    {
        public int CharacterId { get; set; }
        public int ChallengeId { get; set; }
        public int StateId { get; set; } // Use numeric ID (1-5) from frontend
        public string? Details { get; set; }
    }

    // Payload for updating an assignment
    public class UpdateManagementPayload
    {
        public int StateId { get; set; } // Use numeric ID (1-5) from frontend
        public string? Details { get; set; }
    }

    // DTO for returning assignment details
    public class ManagementDetailsViewModel
    {
        public string State { get; set; } = string.Empty; // Store state as text
        public string? Details { get; set; }
        public bool IsClosed { get; set; }
    }

    // --- API Controller ---

    [ApiController]
    [Route("api/[controller]")] // Sets the base route to /api/Management
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

        // Helper to convert state ID (1-5) to the text stored in DB
        // You might move this to a shared utility class or the service layer
        private string GetStateTextFromId(int stateId)
        {
            // This assumes Resources class is accessible or you replicate the mapping
            // return ManagementPageViewModel.GetStateText(stateId); // If using the old VM helper

            // Or direct mapping:
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
            var assignedChallenges = await _managementService.GetAssignedChallenges(characterId); // Service returns List<Challenge>
            var closedChallenges = await _managementService.GetClosedChallenges(characterId); // Service returns List<Challenge>

            var assignedOrClosedIds = assignedChallenges.Select(c => c.ID)
                                       .Union(closedChallenges.Select(c => c.ID))
                                       .ToHashSet();

            var available = allChallenges
                .Where(c => !assignedOrClosedIds.Contains(c.ID))
                // *** Ensure FULL mapping here ***
                .Select(c => new ChallengeViewModel {
                    Id = c.ID,
                    Title = c.Title,
                    RequiredBravery = c.RequiredBravery, // Add this
                    RequiredTrust = c.RequiredTrust,     // Add this
                    RequiredPresence = c.RequiredPresence, // Add this
                    RequiredGrowth = c.RequiredGrowth,   // Add this
                    RequiredCare = c.RequiredCare,     // Add this
                    GainableBravery = c.GainableBravery, // Add this
                    GainableTrust = c.GainableTrust,     // Add this
                    GainablePresence = c.GainablePresence, // Add this
                    GainableGrowth = c.GainableGrowth,   // Add this
                    GainableCare = c.GainableCare      // Add this
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

            var assigned = await _managementService.GetAssignedChallenges(characterId); // Service returns List<Challenge> for *non-closed*

            var viewModels = assigned.Select(c => new ChallengeViewModel {
                Id = c.ID,
                Title = c.Title,
                RequiredBravery = c.RequiredBravery, // Add this
                RequiredTrust = c.RequiredTrust,     // Add this
                RequiredPresence = c.RequiredPresence, // Add this
                RequiredGrowth = c.RequiredGrowth,   // Add this
                RequiredCare = c.RequiredCare,     // Add this
                GainableBravery = c.GainableBravery, // Add this
                GainableTrust = c.GainableTrust,     // Add this
                GainablePresence = c.GainablePresence, // Add this
                GainableGrowth = c.GainableGrowth,   // Add this
                GainableCare = c.GainableCare      // Add this
            }).ToList();


            return Ok(viewModels);
        }

        // GET: api/Management/{characterId}/{challengeId}
        [HttpGet("{characterId}/{challengeId}")]
        public async Task<ActionResult<ManagementDetailsViewModel>> GetAssignmentDetails(int characterId, int challengeId)
        {
            var management = await _managementService.GetManagement(characterId, challengeId);
            if (management == null)
            {
                // It might not exist if it's an 'available' challenge, which is not an error in that context
                // But if the frontend calls this only for assigned, then NotFound is correct.
                return NotFound("Assignment not found.");
            }

            var detailsViewModel = new ManagementDetailsViewModel
            {
                State = management.State, // State is already stored as text
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

            // Check if already assigned (and not closed)
            var existingManagement = await _managementService.GetManagement(payload.CharacterId, payload.ChallengeId);
            if (existingManagement != null && !existingManagement.IsClosed)
            {
                return BadRequest("Challenge is already assigned to this character.");
            }
             if (existingManagement != null && existingManagement.IsClosed)
            {
                // Decide if re-assigning a closed challenge is allowed. If so, maybe update the existing record?
                return BadRequest("This challenge was previously completed/closed by this character.");
                 // Or: update existing record's IsClosed = false, State, Details
            }


            // --- Stat Check ---
            var insufficientStats = new List<string>();
            if (!IsStatSufficient(character.Growth, challenge.RequiredGrowth)) insufficientStats.Add(Resources.Value_Growth);
            if (!IsStatSufficient(character.Care, challenge.RequiredCare)) insufficientStats.Add(Resources.Value_Care);
            if (!IsStatSufficient(character.Presence, challenge.RequiredPresence)) insufficientStats.Add(Resources.Value_Presence);
            if (!IsStatSufficient(character.Bravery, challenge.RequiredBravery)) insufficientStats.Add(Resources.Value_Bravery);
            if (!IsStatSufficient(character.Trust, challenge.RequiredTrust)) insufficientStats.Add(Resources.Value_Trust);

            if (insufficientStats.Count > 0)
            {
                return BadRequest($"Insufficient stats: {string.Join(", ", insufficientStats).ToLower()}.");
            }
            // --- End Stat Check ---

            try
            {
                string stateText = GetStateTextFromId(payload.StateId);
                await _managementService.AssignChallenge(payload.CharacterId, payload.ChallengeId, payload.StateId, payload.Details); // Adjust service if needed
                // The service method above needs to use the StateId/StateText correctly
                // Let's assume the service's AssignChallenge takes the state ID and handles the text conversion, or takes the text directly
                // await _managementService.AssignChallenge(payload.CharacterId, payload.ChallengeId, stateText, payload.Details); // Alternative if service expects text

                await _managementService.SaveChanges();

                // What to return? Ok() is simple. CreatedAtAction requires a GET endpoint for the specific assignment.
                 return Ok(new { message = "Challenge assigned successfully." });
                // Or return CreatedAtAction(nameof(GetAssignmentDetails), new { characterId = payload.CharacterId, challengeId = payload.ChallengeId }, payload);
            }
            catch (Exception ex)
            {
                // Log exception ex
                return StatusCode(500, "An error occurred while assigning the challenge.");
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
                string newStateText = GetStateTextFromId(payload.StateId);
                // Update using service methods that take text state? Or update entity directly?
                // Option 1: Use service methods (preferred if they exist)
                 await _managementService.UpdateState(characterId, challengeId, newStateText);
                 await _managementService.UpdateManagementDetails(characterId, challengeId, payload.Details);
                 // These service methods should call SaveChanges internally or require a separate call

                // Option 2: Update entity directly (if service methods don't exist/fit)
                // management.State = newStateText;
                // management.Details = payload.Details;
                // await _managementService.SaveChanges(); // Ensure this saves the changes

                return NoContent(); // Success
            }
            catch (DbUpdateConcurrencyException)
            {
                throw; // Or handle concurrency
            }
            catch (Exception ex)
            {
                 // Log ex
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

            // Require 'Completed' state to close and gain stats
            string completedStateText = GetStateTextFromId(3); // 3 = Completed
            if (management.State != completedStateText)
            {
                return BadRequest($"Challenge must be in '{completedStateText}' state to close and gain stats.");
            }

            try
            {
                // Update character stats
                character.Bravery += challenge.GainableBravery ?? 0;
                character.Trust += challenge.GainableTrust ?? 0;
                character.Presence += challenge.GainablePresence ?? 0;
                character.Growth += challenge.GainableGrowth ?? 0;
                character.Care += challenge.GainableCare ?? 0;

                // Mark management as closed
                management.IsClosed = true;

                // Save changes for both character stats and management status
                await _managementService.SaveChanges(); // Service should save context changes

                 // Map updated character to return it
                 var updatedCharacterViewModel = new CharacterViewModel {
                     Id = character.ID,
                     Name = character.Name,
                     Bravery = character.Bravery,
                     Trust = character.Trust,
                     Presence = character.Presence,
                     Growth = character.Growth,
                     Care = character.Care
                 };

                // Return 200 OK with the updated character data
                return Ok(updatedCharacterViewModel);
            }
            catch (Exception ex)
            {
                // Log ex
                return StatusCode(500, "An error occurred while closing the challenge.");
            }
        }


        // Helper from original MVC controller - check if stats are sufficient
        private bool IsStatSufficient(int characterStat, int? requiredStat)
        {
            return requiredStat == null || characterStat >= requiredStat.Value;
        }
    }
}