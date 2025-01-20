using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Services
{
    public interface IChallengeService
    {
        Task<List<Challenge>> GetAllChallenges();

        Task<Challenge?> GetChallengeById(int id);

        Task SaveNewChallenge(Challenge challenge);

        Task SaveChanges();
    }
}
