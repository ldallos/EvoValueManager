using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Services
{
    public class ManagementService : IManagementService
    {
        public ManagementService(CharacterManagerContext context, IChallengeService challengeService)
        {
            myContext = context;
            myChallengeService = challengeService;
            context.Database.EnsureCreated();
        }

        public async Task AssignChallenge(int characterId, int challengeId, string details)
        {
            await myContext.Managements.AddAsync(
                new Management
                {
                    CharacterId = characterId,
                    ChallangeId = challengeId,
                    State = "Assigned",
                    Details = details
                }
            );
        }

        public async Task<List<Challenge>> GetAssignedChallenges(int characterId)
        {
            List<Management> mangagements = await myContext.Managements
                .Where(management => management.CharacterId == characterId)
                .ToListAsync();

            List<Challenge> challenges = new List<Challenge>();
            foreach (Management management in mangagements)
            {
                Challenge? challange = await myChallengeService.GetChallengeById(management.ChallangeId);
                if (challange != null)
                {
                    challenges.Add(challange);
                }
            }

            return challenges;
        }

        public async Task<string> GetManagementDetails(int characterId, int challengeId)
        {
            var management = await myContext.Managements
                .FirstOrDefaultAsync(m => m.CharacterId == characterId && m.ChallangeId == challengeId);

            return management?.Details ?? string.Empty;
        }


        public async Task RemoveManagement(int characterId, int challengeId)
        {
            Management management = await myContext.Managements.SingleAsync(management =>
                management.CharacterId == characterId && management.ChallangeId == challengeId);

            myContext.Managements.Remove(management);
        }

        public async Task UpdateManagementDetails(int characterId, int challengeId, string? details)
        {
            var managementEntry = await myContext.Managements
                .FirstOrDefaultAsync(m => m.CharacterId == characterId && m.ChallangeId == challengeId);

            if (managementEntry != null)
            {
                managementEntry.Details = details;
                await myContext.SaveChangesAsync();
            }
        }


        public async Task SaveChanges()
        {
            await myContext.SaveChangesAsync();
        }

        private readonly CharacterManagerContext myContext;
        private readonly IChallengeService myChallengeService;
    }
}