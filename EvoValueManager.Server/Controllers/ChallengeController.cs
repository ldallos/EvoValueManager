using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChallengeController : ControllerBase
    {
        private readonly IChallengeService _challengeService;

        public ChallengeController(IChallengeService service)
        {
            _challengeService = service;
        }

        // GET: api/Challenge
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChallengeViewModel>>> GetChallenges()
        {
            var challenges = await _challengeService.GetAllChallenges();
            
            var viewModels = challenges.Select(c => new ChallengeViewModel
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

        // GET: api/Challenge/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChallengeViewModel>> GetChallenge(int id)
        {
            var challenge = await _challengeService.GetChallengeById(id);

            if (challenge == null)
            {
                return NotFound();
            }

            var viewModel = new ChallengeViewModel
            {
                 Id = challenge.ID,
                 Title = challenge.Title,
                 RequiredBravery = challenge.RequiredBravery,
                 RequiredTrust = challenge.RequiredTrust,
                 RequiredPresence = challenge.RequiredPresence,
                 RequiredGrowth = challenge.RequiredGrowth,
                 RequiredCare = challenge.RequiredCare,
                 GainableBravery = challenge.GainableBravery,
                 GainableTrust = challenge.GainableTrust,
                 GainablePresence = challenge.GainablePresence,
                 GainableGrowth = challenge.GainableGrowth,
                 GainableCare = challenge.GainableCare
            };

            return Ok(viewModel);
        }

        // POST: api/Challenge
        [HttpPost]
        public async Task<ActionResult<ChallengeViewModel>> PostChallenge([FromBody] ChallengeViewModel challengeViewModel)
        {
            if (string.IsNullOrWhiteSpace(challengeViewModel.Title))
            {
                return BadRequest("Challenge title cannot be empty.");
            }
            
            var challenge = new Challenge
            {
                ID = challengeViewModel.Id,
                Title = challengeViewModel.Title,
                RequiredBravery = challengeViewModel.RequiredBravery,
                RequiredTrust = challengeViewModel.RequiredTrust,
                RequiredPresence = challengeViewModel.RequiredPresence,
                RequiredGrowth = challengeViewModel.RequiredGrowth,
                RequiredCare = challengeViewModel.RequiredCare,
                GainableBravery = challengeViewModel.GainableBravery,
                GainableTrust = challengeViewModel.GainableTrust,
                GainablePresence = challengeViewModel.GainablePresence,
                GainableGrowth = challengeViewModel.GainableGrowth,
                GainableCare = challengeViewModel.GainableCare
            };

            await _challengeService.SaveNewChallenge(challenge);
            
            var createdViewModel = new ChallengeViewModel
            {
                Title = challenge.Title,
                RequiredBravery = challenge.RequiredBravery,
                RequiredTrust = challenge.RequiredTrust,
                RequiredPresence = challenge.RequiredPresence,
                RequiredGrowth = challenge.RequiredGrowth,
                RequiredCare = challenge.RequiredCare,
                GainableBravery = challenge.GainableBravery,
                GainableTrust = challenge.GainableTrust,
                GainablePresence = challenge.GainablePresence,
                GainableGrowth = challenge.GainableGrowth,
                GainableCare = challenge.GainableCare
            };


            return CreatedAtAction(nameof(GetChallenge), new { id = challenge.ID }, createdViewModel);
        }

        // PUT: api/Challenge/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChallenge(int id, [FromBody] ChallengeViewModel challengeViewModel)
        {
            if (id != challengeViewModel.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (string.IsNullOrWhiteSpace(challengeViewModel.Title))
            {
                return BadRequest("Challenge title cannot be empty.");
            }


            var challengeToUpdate = await _challengeService.GetChallengeById(id);

            if (challengeToUpdate == null)
            {
                return NotFound();
            }

            challengeToUpdate.Title = challengeViewModel.Title;
            challengeToUpdate.RequiredBravery = challengeViewModel.RequiredBravery;
            challengeToUpdate.RequiredTrust = challengeViewModel.RequiredTrust;
            challengeToUpdate.RequiredPresence = challengeViewModel.RequiredPresence;
            challengeToUpdate.RequiredGrowth = challengeViewModel.RequiredGrowth;
            challengeToUpdate.RequiredCare = challengeViewModel.RequiredCare;
            challengeToUpdate.GainableBravery = challengeViewModel.GainableBravery;
            challengeToUpdate.GainableTrust = challengeViewModel.GainableTrust;
            challengeToUpdate.GainablePresence = challengeViewModel.GainablePresence;
            challengeToUpdate.GainableGrowth = challengeViewModel.GainableGrowth;
            challengeToUpdate.GainableCare = challengeViewModel.GainableCare;

            await _challengeService.SaveChanges();

            return NoContent();
        }
    }
}