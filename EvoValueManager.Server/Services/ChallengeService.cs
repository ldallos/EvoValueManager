using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Services
{
    public class ChallengeService : IChallengeService
    {
        public ChallengeService(CharacterManagerContext context)
        {
            myContext = context;
        }

        public async Task<List<Challenge>> GetAllChallenges()
        {
            return await myContext.Challenges.ToListAsync();
        }

        public async Task<Challenge?> GetChallengeById(int id)
        {
            return await myContext.Challenges.FindAsync(id);
        }
        public async Task SaveNewChallenge(Challenge challenge)
        {
            await myContext.Challenges.AddAsync(challenge);
            await myContext.SaveChangesAsync();
        }
        
        public async Task DeleteChallengeAsync(int id)
        {
            var challenge = await myContext.Challenges.FindAsync(id);
            if (challenge != null)
            {
                myContext.Challenges.Remove(challenge);
                await myContext.SaveChangesAsync();
            }
        }

        public async Task SaveChanges()
        {
            await myContext.SaveChangesAsync();
        }

        private readonly CharacterManagerContext myContext;
    }
}
