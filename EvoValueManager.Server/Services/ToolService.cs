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
        
        public async Task DeleteToolAsync(int id)
        {
            var tool = await _context.Tools.FindAsync(id);
            if (tool != null)
            {
                _context.Tools.Remove(tool);
                await _context.SaveChangesAsync();
            }
        }
        
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}