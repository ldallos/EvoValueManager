using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using EvoValueManager.Models.Shared;
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
            int? selectedAssignedId, 
            int? selectedCharacterId,
            int? selectedChallengeId)
        {
            var viewModel = await InitializeViewModel(selectedAssignedId, selectedCharacterId);

            if (selectedCharacterId.HasValue)
            {
                await PopulateCharacterRelatedData(viewModel, selectedCharacterId.Value, selectedChallengeId);
            }

            return View(viewModel);
        }

        private async Task<ManagementPageViewModel> InitializeViewModel(int? selectedAssignedId, int? selectedCharacterId)
        {
            var characters = await myCharacterService.GetAllCharacters();
            var characterViewModels = await GetFilteredCharacterViewModels(characters, selectedAssignedId);

            return new ManagementPageViewModel
            {
                SelectedAssignedId = selectedAssignedId ?? 1,
                SelectedCharacterId = selectedCharacterId ?? 0,
                SelectableCharacters = new SelectList(characterViewModels, "Id", "Name")
            };
        }

        private async Task<List<CharacterViewModel>> GetFilteredCharacterViewModels(
            IEnumerable<Character> characters,
            int? selectedAssignedId)
        {
            var characterList = new List<CharacterViewModel>();
            var allChallenges = await myChallengeService.GetAllChallenges();

            foreach (var character in characters)
            {
                var assignedChallenges = await myManagementService.GetAssignedChallenges(character.ID);
                var closedChallenges = await myManagementService.GetClosedChallenges(character.ID);
                
                bool shouldIncludeCharacter = selectedAssignedId is null or 1
                    ? allChallenges.Any(c =>
                        !assignedChallenges.Contains(c) &&
                        !closedChallenges.Contains(c))
                    : selectedAssignedId != 2 || assignedChallenges.Count != 0;

                if (shouldIncludeCharacter)
                {
                    characterList.Add(CreateCharacterViewModel(character));
                }
            }

            return characterList;
        }

        private static CharacterViewModel CreateCharacterViewModel(Character character) =>
            new()
            {
                Name = character.Name,
                Id = character.ID,
                Bravery = character.Bravery,
                Trust = character.Trust,
                Presence = character.Presence,
                Growth = character.Growth,
                Care = character.Care
            };

        private async Task PopulateCharacterRelatedData(ManagementPageViewModel viewModel, int selectedCharacterId,
            int? selectedChallengeId)
        {
            await PopulateSelectableChallenges(viewModel, selectedCharacterId);
            await PopulateSelectedCharacter(viewModel, selectedCharacterId);

            if (selectedChallengeId.HasValue)
            {
                await PopulateSelectedChallenge(viewModel, selectedCharacterId, selectedChallengeId.Value);
            }
        }

        private async Task PopulateSelectableChallenges(ManagementPageViewModel viewModel, int selectedCharacterId)
        {
            var challenges =
                await GetChallengesBasedOnAssignmentType(viewModel.SelectedAssignedId, selectedCharacterId);
            var challengeViewModels = challenges.Select(CreateChallengeViewModel).ToList();
            viewModel.SelectableChallenges = new SelectList(challengeViewModels, "Id", "Title");
        }

        private async Task<List<Challenge>> GetChallengesBasedOnAssignmentType(int selectedAssignedId, int characterId)
        {
            if (selectedAssignedId == 1)
            {
                var allChallenges = await myChallengeService.GetAllChallenges();
                var assignedChallenges = await myManagementService.GetAssignedChallenges(characterId);
                var closedChallenges = await myManagementService.GetClosedChallenges(characterId);

                return allChallenges
                    .Where(c => !assignedChallenges.Contains(c) && !closedChallenges.Contains(c))
                    .ToList();
            }
    
            return await myManagementService.GetAssignedChallenges(characterId);
        }

        private static ChallengeViewModel CreateChallengeViewModel(Challenge challenge) =>
            new()
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

        private async Task PopulateSelectedCharacter(ManagementPageViewModel viewModel, int selectedCharacterId)
        {
            var character = await myCharacterService.GetCharacterById(selectedCharacterId);
            if (character != null)
            {
                viewModel.SelectedCharacter = CreateCharacterViewModel(character);
            }
        }

        private async Task PopulateSelectedChallenge(ManagementPageViewModel viewModel, int selectedCharacterId,
            int selectedChallengeId)
        {
            var challenge = await myChallengeService.GetChallengeById(selectedChallengeId);
            if (challenge != null)
            {
                viewModel.SelectedChallenge = CreateChallengeViewModel(challenge);
                viewModel.Details =
                    await myManagementService.GetManagementDetails(selectedCharacterId, selectedChallengeId);
                await PopulateChallengeState(viewModel, selectedCharacterId, selectedChallengeId);
            }
        }

        private async Task PopulateChallengeState(ManagementPageViewModel viewModel, int selectedCharacterId,
            int selectedChallengeId)
        {
            var currentState = await myManagementService.GetState(selectedCharacterId, selectedChallengeId);
            if (currentState != null)
            {
                viewModel.SelectedStateId = MapStateToId(currentState);
            }
        }

        private static int MapStateToId(string state)
        {
            if (state == Resources.ChallengeState_New)
                return 1;
            if (state == Resources.ChallengeState_InProgress)
                return 2;
            if (state == Resources.ChallengeState_Completed)
                return 3;
            if (state == Resources.ChallengeState_Suspended)
                return 4;
            if (state == Resources.ChallengeState_Cancelled)
                return 5;
            return 1;
        }
        
        private bool IsStatSufficient(int characterStat, int? requiredStat)
        {
            return requiredStat == null || characterStat >= requiredStat;
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
            await myManagementService.UpdateManagementDetails(viewModel.SelectedCharacterId, viewModel.SelectedChallengeId, viewModel.Details);
    
            if (viewModel.SelectedStateId != 0)
            {
                await myManagementService.UpdateState(viewModel.SelectedCharacterId, viewModel.SelectedChallengeId, ManagementPageViewModel.GetStateText(viewModel.SelectedStateId));
            }

            TempData["UpdateSuccess"] = Resources.UpdateSuccess;

            return RedirectToAction("Management", new
            {
                selectedAssignedId = viewModel.SelectedAssignedId,
                selectedCharacterId = viewModel.SelectedCharacterId,
                selectedChallengeId = viewModel.SelectedChallengeId,
                selectedStateId = viewModel.SelectedStateId
            });
        }

        [HttpPost]
        public async Task<IActionResult> AssignChallenge(ManagementPageViewModel viewModel)
        {
            var character = await myCharacterService.GetCharacterById(viewModel.SelectedCharacterId);
            var challenge = await myChallengeService.GetChallengeById(viewModel.SelectedChallengeId);

            if (character == null || challenge == null)
            {
                return RedirectToAction("Management");
            }

            var insufficientStats = new List<string>();
            if (!IsStatSufficient(character.Growth, challenge.RequiredGrowth)) insufficientStats.Add(Resources.Value_Growth.ToLower());
            if (!IsStatSufficient(character.Care, challenge.RequiredCare)) insufficientStats.Add(Resources.Value_Care.ToLower());
            if (!IsStatSufficient(character.Presence, challenge.RequiredPresence)) insufficientStats.Add(Resources.Value_Presence.ToLower());
            if (!IsStatSufficient(character.Bravery, challenge.RequiredBravery)) insufficientStats.Add(Resources.Value_Bravery.ToLower());
            if (!IsStatSufficient(character.Trust, challenge.RequiredTrust)) insufficientStats.Add(Resources.Value_Trust.ToLower());
            
            if (insufficientStats.Count != 0)
            {
                TempData["ErrorMessage"] = string.Format(Resources.InsufficientStats, string.Join(", ", insufficientStats.ToArray()).ToLower());
                return RedirectToAction("Management", new
                {
                    selectedAssignedId = viewModel.SelectedAssignedId,
                    selectedCharacterId = viewModel.SelectedCharacterId,
                    selectedChallengeId = viewModel.SelectedChallengeId
                });
            }

            await myManagementService.AssignChallenge(viewModel.SelectedCharacterId, viewModel.SelectedChallengeId, viewModel.SelectedStateId, viewModel.Details);
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

            var management = await myManagementService.GetManagement(viewModel.SelectedCharacterId, viewModel.SelectedChallengeId);
            
            if (management != null)
            {
                management.IsClosed = true;
            }

            await myManagementService.SaveChanges();

            return RedirectToAction("Management");
        }

        private readonly IManagementService myManagementService;
        private readonly ICharacterService myCharacterService;
        private readonly IChallengeService myChallengeService;
    }
}