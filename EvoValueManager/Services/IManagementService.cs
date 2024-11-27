using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Services
{
    public interface IManagementService
    {
        Task AssignChallenge(int characterId, int challengeId, string? details = null);

        Task<List<Challenge>> GetAssignedChallenges(int characterId);

        Task<string> GetManagementDetails(int characterId, int challengeId);

        Task<Management?> GetManagement(int characterId, int challengeId);

        Task<List<Challenge>> GetClosedChallenges(int characterId);

        Task RemoveManagement(int characterId, int challengeId);

        Task UpdateManagementDetails(int characterId, int challengeId, string? details);

        Task UpdateState(int characterId, int challengeId, string state);

        Task<string?> GetState(int characterId, int challengeId);

        Task SaveChanges();
    }
}