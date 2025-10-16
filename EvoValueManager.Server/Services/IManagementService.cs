using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Services
{
    public interface IManagementService
    {
        Task AssignChallenge(int characterId, int challengeId, int stateId, string? details = null);

        Task<List<Challenge>> GetAssignedChallenges(int characterId);

        Task<Management?> GetManagement(int characterId, int challengeId);

        Task<List<Challenge>> GetClosedChallenges(int characterId);

        Task UpdateManagement(int characterId, int challengeId, int stateId, string? details);
    }
}