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
        }

        public async Task AssignChallenge(int characterId, int challengeId, int stateId, string? details)
        {
            await myContext.Managements.AddAsync(
                new Management
                {
                    CharacterId = characterId,
                    ChallengeId = challengeId,
                    StateId = stateId,
                    Details = details
                }
            );
            await myContext.SaveChangesAsync();
        }

        public async Task<List<Challenge>> GetAssignedChallenges(int characterId)
        {
            var challenges = await myContext.Managements
                .Where(m => m.CharacterId == characterId && !m.IsClosed)
                .Join(
                    myContext.Challenges,
                    management => management.ChallengeId,
                    challenge => challenge.ID,
                    (management, challenge) => challenge
                )
                .ToListAsync();

            return challenges;
        }

        public async Task<Management?> GetManagement(int characterId, int challengeId)
        {
            return await myContext.Managements
                .FirstOrDefaultAsync(m => m.CharacterId == characterId && m.ChallengeId == challengeId);
        }

        public async Task UpdateManagement(int characterId, int challengeId, int stateId, string? details)
        {
            var managementEntry = await myContext.Managements
                .FirstOrDefaultAsync(m => m.CharacterId == characterId && m.ChallengeId == challengeId);

            if (managementEntry != null)
            {
                managementEntry.StateId = stateId;
                managementEntry.Details = details;
                await myContext.SaveChangesAsync();
            }
        }

        public async Task<List<Challenge>> GetClosedChallenges(int characterId)
        {
            List<Challenge> challenges = await myContext.Managements
                .Where(m => m.CharacterId == characterId && m.IsClosed)
                .Join(
                    myContext.Challenges,
                    management => management.ChallengeId,
                    challenge => challenge.ID,
                    (management, challenge) => challenge
                )
                .ToListAsync();

            return challenges;
        }

        private readonly CharacterManagerContext myContext;
        private readonly IChallengeService myChallengeService;
    }
}