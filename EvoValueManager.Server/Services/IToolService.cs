using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Services
{
    public interface IToolService
    {
        Task<List<Tool>> GetAllTools();
        Task<Tool?> GetToolById(int id);
        Task<Tool> CreateTool(Tool tool); 
        Task SaveChanges(); 
    }
}