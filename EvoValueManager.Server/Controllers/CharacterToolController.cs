using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Services;
using EvoCharacterManager.Models.ViewModels; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/charactertool")]
    public class CharacterToolController : ControllerBase
    {
        private readonly ICharacterToolService _characterToolService;
        private readonly IToolService _toolService;
        private readonly ICharacterService _characterService;
        private readonly CharacterManagerContext _context;

        public CharacterToolController(
            ICharacterToolService characterToolService,
            IToolService toolService,
            ICharacterService characterService,
            CharacterManagerContext context)
        {
            _characterToolService = characterToolService;
            _toolService = toolService;
            _characterService = characterService;
            _context = context;
        }

        // GET api/charactertool/{characterId}/assigned
        [HttpGet("{characterId}/assigned")]
        public async Task<ActionResult<IEnumerable<ToolViewModel>>> GetAssignedTools(int characterId)
        {
            var tools = await _characterToolService.GetAssignedToolsForCharacterAsync(characterId);
            var viewModels = tools.Select(t => new ToolViewModel
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                BraveryBonus = t.BraveryBonus,
                TrustBonus = t.TrustBonus,
                PresenceBonus = t.PresenceBonus,
                GrowthBonus = t.GrowthBonus,
                CareBonus = t.CareBonus
            }).ToList();
            return Ok(viewModels);
        }
        
        [HttpGet("{characterId}/available")]
        public async Task<ActionResult<IEnumerable<ToolViewModel>>> GetAvailableToolsForCharacter(int characterId)
        {
            var assignedToolIdsQuery = _context.CharacterTools
                .Where(ct => ct.CharacterId == characterId)
                .Select(ct => ct.ToolId);

            var availableTools = await _context.Tools
                .Where(t => !assignedToolIdsQuery.Contains(t.Id))
                .Select(t => new ToolViewModel
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    BraveryBonus = t.BraveryBonus,
                    TrustBonus = t.TrustBonus,
                    PresenceBonus = t.PresenceBonus,
                    GrowthBonus = t.GrowthBonus,
                    CareBonus = t.CareBonus
                })
                .ToListAsync();

            return Ok(availableTools);
        }
        
        // GET api/charactertool/all-assignments
        [HttpGet("all-assignments")]
        public async Task<ActionResult<IEnumerable<CharacterTool>>> GetAllAssignments()
        {
            return Ok(await _characterToolService.GetAllAssignmentsAsync());
        }

        // POST api/charactertool/{characterId}/assign/{toolId}
        [HttpPost("{characterId}/assign/{toolId}")]
        public async Task<IActionResult> AssignTool(int characterId, int toolId)
        {
            var character = await _characterService.GetCharacterById(characterId);
            if (character == null) return NotFound(new { message = "Character not found." });
            var tool = await _toolService.GetToolById(toolId);
            if (tool == null) return NotFound(new { message = "Tool not found." });

            if (await _characterToolService.IsToolAssignedAsync(characterId, toolId))
            {
                return BadRequest(new { message = "Tool is already assigned to this character." });
            }

            await _characterToolService.AssignToolAsync(characterId, toolId);
            return Ok(new { message = "Tool assigned successfully." });
        }

        // DELETE api/charactertool/{characterId}/unassign/{toolId}
        [HttpDelete("{characterId}/unassign/{toolId}")]
        public async Task<IActionResult> UnassignTool(int characterId, int toolId)
        {
             var character = await _characterService.GetCharacterById(characterId);
            if (character == null) return NotFound(new { message = "Character not found."});
            var tool = await _toolService.GetToolById(toolId);
            if (tool == null) return NotFound(new { message = "Tool not found." });


            if (!await _characterToolService.IsToolAssignedAsync(characterId, toolId))
            {
                return NotFound(new { message = "Tool assignment not found for this character." });
            }
            
            await _characterToolService.UnassignToolAsync(characterId, toolId);
            return Ok(new { message = "Tool unassigned successfully." });
        }
    }
}