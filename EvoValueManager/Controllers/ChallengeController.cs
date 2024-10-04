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

        public async Task<IActionResult> Challenge(int? selectedChallengeId)
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
                        GainableBravery = challenge.GainableBravery,
                        GainableTrust = challenge.GainableTrust,
                        GainablePresence = challenge.GainablePresence
                    };
                }
            }

            var viewModel = new ChallengePageViewModel
            {
                SelectedChallengeId = selectedChallengeId ?? 0,
                SelectedChallenge = selectedChallenge,
                SelectableChallenges = new SelectList(challengeViewModels, "Id", "Title")
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

                await myService.SaveChanges();
            }

            return RedirectToAction("Challenge", new { selectedChallengeId = viewModel.SelectedChallengeId });
        }

        private readonly IChallengeService myService;
    }
}
