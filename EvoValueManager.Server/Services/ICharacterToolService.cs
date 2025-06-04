using EvoCharacterManager.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoCharacterManager.Services
{
    public interface ICharacterToolService
    {
        Task AssignToolAsync(int characterId, int toolId);
        Task UnassignToolAsync(int characterId, int toolId); 
        Task<List<Tool>> GetAssignedToolsForCharacterAsync(int characterId);
        Task<bool> IsToolAssignedAsync(int characterId, int toolId);
    }
}