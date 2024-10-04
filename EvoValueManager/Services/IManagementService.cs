using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Services
{
    public interface IManagementService
    {
        Task AssignChallenge(int characterId, int challengeId);

        Task<List<Challenge>> GetAssignedChallenges(int characterId);

        Task RemoveManagement(int characterId, int challengeId);

        Task SaveChanges();
    }
}
