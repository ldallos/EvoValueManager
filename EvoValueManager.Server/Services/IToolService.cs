using EvoCharacterManager.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

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