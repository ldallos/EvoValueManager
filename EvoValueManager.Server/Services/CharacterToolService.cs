using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EvoCharacterManager.Services
{
    public class CharacterToolService : ICharacterToolService
    {
        private readonly CharacterManagerContext _context;

        public CharacterToolService(CharacterManagerContext context)
        {
            _context = context;
        }

        public async Task AssignToolAsync(int characterId, int toolId)
        {
            var existingAssignment = await _context.CharacterTools
                .FirstOrDefaultAsync(ct => ct.CharacterId == characterId && ct.ToolId == toolId);

            if (existingAssignment == null)
            {
                var characterTool = new CharacterTool { CharacterId = characterId, ToolId = toolId };
                _context.CharacterTools.Add(characterTool);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UnassignToolAsync(int characterId, int toolId)
        {
            var assignment = await _context.CharacterTools
                .FirstOrDefaultAsync(ct => ct.CharacterId == characterId && ct.ToolId == toolId);

            if (assignment != null)
            {
                _context.CharacterTools.Remove(assignment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Tool>> GetAssignedToolsForCharacterAsync(int characterId)
        {
            return await _context.CharacterTools
                .Where(ct => ct.CharacterId == characterId)
                .Include(ct => ct.Tool)
                .Select(ct => ct.Tool!) 
                .ToListAsync();
        }

        public async Task<bool> IsToolAssignedAsync(int characterId, int toolId)
        {
             return await _context.CharacterTools
                .AnyAsync(ct => ct.CharacterId == characterId && ct.ToolId == toolId);
        }
    }
}