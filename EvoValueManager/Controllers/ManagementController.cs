using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace EvoCharacterManager.Controllers
{
    public class ManagementController : Controller
    {
        public ManagementController(
            IManagementService managementService,
            ICharacterService characterService,
            IChallengeService challengeService)
        {
            myManagementService = managementService;
            myCharacterService = characterService;
            myChallengeService = challengeService;
        }

        public async Task<IActionResult> Management(
            int? selectedAssignedId, int? selectedCharacterId, int? selectedChallengeId)
        {
            var characters = await myCharacterService.GetAllCharacters();

            var characterViewModels = characters.Select(c => new CharacterViewModel
            {
                Name = c.Name,
                Id = c.ID,
            }).ToList();

            var viewModel = new ManagementPageViewModel
            {
                SelectedAssignedId = selectedAssignedId ?? 1,
                SelectableCharacters = new SelectList(characterViewModels, "Id", "Name")
            };

            if (selectedCharacterId.HasValue)
            {
                List<Challenge> challenges;
                if (viewModel.SelectedAssignedId == 1)
                {
                    var allChallenges = await myChallengeService.GetAllChallenges();
                    var assignedChallenges = await myManagementService.GetAssignedChallenges(selectedCharacterId.Value);
                    challenges = allChallenges
                        .Where(c => !assignedChallenges.Contains(c))
                        .ToList();
                }
                else
                {
                    challenges = await myManagementService.GetAssignedChallenges(selectedCharacterId.Value);
                }

                var challengeViewModels = challenges.Select(c => new ChallengeViewModel
                {
                    Id = c.ID,
                    Title = c.Title
                }).ToList();

                viewModel.SelectableChallenges = new SelectList(challengeViewModels, "Id", "Title");

                var character = await myCharacterService.GetCharacterById(selectedCharacterId.Value);
                if (character != null)
                {
                    viewModel.SelectedCharacter = new CharacterViewModel
                    {
                        Id = character.ID,
                        Name = character.Name,
                        Bravery = character.Bravery,
                        Trust = character.Trust,
                        Presence = character.Presence,
                        Growth = character.Growth,
                        Care = character.Care
                    };
                }

                if (selectedChallengeId.HasValue)
                {
                    var challenge = await myChallengeService.GetChallengeById(selectedChallengeId.Value);
                    if (challenge != null)
                    {
                        viewModel.SelectedChallenge = new ChallengeViewModel
                        {
                            Id = challenge.ID,
                            Title = challenge.Title,
                            RequiredBravery = challenge.RequiredBravery,
                            RequiredTrust = challenge.RequiredTrust,
                            RequiredPresence = challenge.RequiredPresence,
                            RequiredCare = challenge.RequiredCare,
                            RequiredGrowth = challenge.RequiredGrowth,
                            GainableBravery = challenge.GainableBravery,
                            GainableTrust = challenge.GainableTrust,
                            GainablePresence = challenge.GainablePresence,
                            GainableCare = challenge.GainableCare,
                            GainableGrowth = challenge.GainableGrowth
                        };
                        viewModel.Details =
                            await myManagementService.GetManagementDetails(selectedCharacterId.Value,
                                selectedChallengeId.Value);
                    }
                }
            }

            return View(viewModel);
        }

        [HttpPost]
        public IActionResult Assign(ManagementPageViewModel viewModel)
        {
            return RedirectToAction("Management", new { selectedAssignedId = viewModel.SelectedAssignedId });
        }

        [HttpPost]
        public IActionResult CharacterSelection(ManagementPageViewModel viewModel)
        {
            if (viewModel.SelectedCharacterId > 0)
            {
                return RedirectToAction(
                    "Management",
                    new
                    {
                        selectedAssignedId = viewModel.SelectedAssignedId,
                        selectedCharacterId = viewModel.SelectedCharacterId
                    });
            }

            return RedirectToAction("Management");
        }

        [HttpPost]
        public IActionResult ChallengeSelection(ManagementPageViewModel viewModel)
        {
            if (viewModel.SelectedChallengeId > 0)
            {
                return RedirectToAction(
                    "Management",
                    new
                    {
                        selectedAssignedId = viewModel.SelectedAssignedId,
                        selectedCharacterId = viewModel.SelectedCharacterId,
                        selectedChallengeId = viewModel.SelectedChallengeId
                    });
            }

            return RedirectToAction("Management", new { selectedCharacterId = viewModel.SelectedCharacterId });
        }


        [HttpPost]
        public async Task<IActionResult> UpdateChallengeDetails(ManagementPageViewModel viewModel)
        {
            await myManagementService.UpdateManagementDetails(
                viewModel.SelectedCharacterId,
                viewModel.SelectedChallengeId,
                viewModel.Details
            );

            TempData["UpdateSuccess"] = "Sikeresen frissítve";

            return RedirectToAction("Management", new
            {
                selectedAssignedId = viewModel.SelectedAssignedId,
                selectedCharacterId = viewModel.SelectedCharacterId,
                selectedChallengeId = viewModel.SelectedChallengeId
            });
        }

        [HttpPost]
        public async Task<IActionResult> AssignChallenge(ManagementPageViewModel viewModel)
        {
            await myManagementService.AssignChallenge(
                viewModel.SelectedCharacterId,
                viewModel.SelectedChallengeId,
                viewModel.Details
            );

            await myManagementService.SaveChanges();

            return RedirectToAction("Management");
        }

        [HttpPost]
        public async Task<IActionResult> CloseChallenge(ManagementPageViewModel viewModel)
        {
            Character? character = await myCharacterService.GetCharacterById(viewModel.SelectedCharacterId);
            Challenge? challenge = await myChallengeService.GetChallengeById(viewModel.SelectedChallengeId);

            if (character == null || challenge == null) return RedirectToAction("Management");

            character.Bravery += challenge.GainableBravery ?? 0;
            character.Trust += challenge.GainableTrust ?? 0;
            character.Presence += challenge.GainablePresence ?? 0;
            character.Growth += challenge.GainableGrowth ?? 0;
            character.Care += challenge.GainableCare ?? 0;

            await myManagementService.RemoveManagement(viewModel.SelectedCharacterId,
                viewModel.SelectedChallengeId);

            await myManagementService.SaveChanges();

            return RedirectToAction("Management");
        }


        private readonly IManagementService myManagementService;
        private readonly ICharacterService myCharacterService;
        private readonly IChallengeService myChallengeService;
    }
}