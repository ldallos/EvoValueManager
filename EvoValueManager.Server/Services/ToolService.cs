using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Services
{
    public class ToolService : IToolService
    {
        private readonly CharacterManagerContext _context;

        public ToolService(CharacterManagerContext context)
        {
            _context = context;
            _context.Database.EnsureCreated(); 
        }

        public async Task<List<Tool>> GetAllTools()
        {
            return await _context.Tools.ToListAsync();
        }

        public async Task<Tool?> GetToolById(int id)
        {
            return await _context.Tools.FindAsync(id);
        }

        public async Task<Tool> CreateTool(Tool tool)
        {
            _context.Tools.Add(tool);
            await _context.SaveChangesAsync();
            return tool; 
        }
        
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}