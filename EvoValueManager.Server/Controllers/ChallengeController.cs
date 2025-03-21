using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace EvoCharacterManager.Controllers
{
    public class ChallengeController : Controller
    {
        public ChallengeController(IChallengeService service)
        {
            myService = service;
        }

        public async Task<IActionResult> Challenge(int? selectedChallengeId, bool? addChallenge)
        {
            var challenges = await myService.GetAllChallenges();

            var challengeViewModels = challenges.Select(c => new ChallengeViewModel
            {
                Id = c.ID,
                Title = c.Title
            }).ToList();

            ChallengeViewModel? selectedChallenge = null;
            if (selectedChallengeId.HasValue)
            {
                var challenge = await myService.GetChallengeById(selectedChallengeId.Value);
                if (challenge != null)
                {
                    selectedChallenge = new ChallengeViewModel
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
                }
            }

            var viewModel = new ChallengePageViewModel
            {
                SelectedChallengeId = selectedChallengeId ?? 0,
                SelectedChallenge = selectedChallenge,
                SelectableChallenges = new SelectList(challengeViewModels, "Id", "Title"),
                AddChallenge = addChallenge ?? false
            };

            return View(viewModel);
        }

        [HttpPost]
        public IActionResult ChallengeSelection(ChallengePageViewModel viewModel)
        {
            return RedirectToAction("Challenge", new { selectedChallengeId = viewModel.SelectedChallengeId });
        }

        [HttpPost]
        public async Task<IActionResult> SaveChallengeChange(ChallengePageViewModel viewModel)
        {
            var challenge = await myService.GetChallengeById(viewModel.SelectedChallengeId);
            if (challenge != null && viewModel.SelectedChallenge != null)
            {
                challenge.Title = viewModel.SelectedChallenge.Title;
                challenge.RequiredBravery = viewModel.SelectedChallenge.RequiredBravery;
                challenge.RequiredTrust = viewModel.SelectedChallenge.RequiredTrust;
                challenge.RequiredPresence = viewModel.SelectedChallenge.RequiredPresence;
                challenge.RequiredGrowth = viewModel.SelectedChallenge.RequiredGrowth;
                challenge.RequiredCare = viewModel.SelectedChallenge.RequiredCare;
                challenge.GainableBravery = viewModel.SelectedChallenge.GainableBravery;
                challenge.GainableTrust = viewModel.SelectedChallenge.GainableTrust;
                challenge.GainablePresence = viewModel.SelectedChallenge.GainablePresence;
                challenge.GainableGrowth = viewModel.SelectedChallenge.GainableGrowth;
                challenge.GainableCare = viewModel.SelectedChallenge.GainableCare;

                await myService.SaveChanges();
            }

            return RedirectToAction("Challenge", new { selectedChallengeId = viewModel.SelectedChallengeId });
        }
        [HttpPost]
        public IActionResult AddChallenge(ChallengePageViewModel viewModel)
        {
            return RedirectToAction("Challenge", new { selectedChallengeId = viewModel.SelectedChallengeId, addChallenge=!viewModel.AddChallenge });
        }

        [HttpPost]
        public async Task<IActionResult> SaveNewChallenge(ChallengePageViewModel viewModel)
        {
            Challenge challenge = new Challenge
            {
                Title = viewModel.NewChallenge.Title,
                RequiredBravery = viewModel.NewChallenge.RequiredBravery,
                RequiredTrust = viewModel.NewChallenge.RequiredTrust,
                RequiredPresence = viewModel.NewChallenge.RequiredPresence,
                RequiredGrowth = viewModel.NewChallenge.RequiredGrowth,
                RequiredCare = viewModel.NewChallenge.RequiredCare,
                GainableBravery = viewModel.NewChallenge.GainableBravery,
                GainableTrust = viewModel.NewChallenge.GainableTrust,
                GainablePresence = viewModel.NewChallenge.GainablePresence,
                GainableGrowth = viewModel.NewChallenge.GainableGrowth,
                GainableCare = viewModel.NewChallenge.GainableCare
            };
            await myService.SaveNewChallenge(challenge);
            return RedirectToAction("Challenge", new { selectedChallengeId = viewModel.SelectedChallengeId });
        }

        private readonly IChallengeService myService;
    }
}
