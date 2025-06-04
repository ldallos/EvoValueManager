using EvoCharacterManager.Services;
using EvoCharacterManager.Models.ViewModels; 
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic; 

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/charactertool")]
    public class CharacterToolController : ControllerBase
    {
        private readonly ICharacterToolService _characterToolService;
        private readonly IToolService _toolService; 
        private readonly ICharacterService _characterService; 

        public CharacterToolController(ICharacterToolService characterToolService, IToolService toolService, ICharacterService characterService)
        {
            _characterToolService = characterToolService;
            _toolService = toolService;
            _characterService = characterService;
        }

        // GET api/charactertool/{characterId}/assigned
        [HttpGet("{characterId}/assigned")]
        public async Task<ActionResult<IEnumerable<ToolViewModel>>> GetAssignedTools(int characterId)
        {
            var character = await _characterService.GetCharacterById(characterId);
            if (character == null) return NotFound("Character not found.");

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
            var character = await _characterService.GetCharacterById(characterId);
            if (character == null) return NotFound("Character not found.");

            var allTools = await _toolService.GetAllTools();
            var assignedTools = await _characterToolService.GetAssignedToolsForCharacterAsync(characterId);
            var assignedToolIds = assignedTools.Select(t => t.Id).ToHashSet();

            var availableTools = allTools
                .Where(t => !assignedToolIds.Contains(t.Id))
                .Select(t => new ToolViewModel { 
                    Id = t.Id, Name = t.Name, Description = t.Description,
                    BraveryBonus = t.BraveryBonus, TrustBonus = t.TrustBonus,
                    PresenceBonus = t.PresenceBonus, GrowthBonus = t.GrowthBonus, CareBonus = t.CareBonus
                })
                .ToList();
            
            return Ok(availableTools);
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