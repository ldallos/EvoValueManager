using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Services
{
    public interface IManagementService
    {
        Task AssignChallenge(int characterId, int challengeId, string? details = null);

        Task<List<Challenge>> GetAssignedChallenges(int characterId);

        Task RemoveManagement(int characterId, int challengeId);

        Task SaveChanges();
        Task<string?> GetManagementDetails(int selectedCharacterId, int selectedChallengeId);

        Task UpdateManagementDetails(int viewModelSelectedCharacterId, int viewModelSelectedChallengeId,
            string? viewModelDetails);
    }
}