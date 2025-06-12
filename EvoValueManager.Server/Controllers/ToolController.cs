using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolController : ControllerBase
    {
        private readonly IToolService _toolService;

        public ToolController(IToolService toolService)
        {
            _toolService = toolService;
        }

        // GET: api/Tool
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToolViewModel>>> GetTools()
        {
            var tools = await _toolService.GetAllTools();
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

        // GET: api/Tool/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ToolViewModel>> GetTool(int id)
        {
            var tool = await _toolService.GetToolById(id);
            if (tool == null)
            {
                return NotFound();
            }
            var viewModel = new ToolViewModel
            {
                Id = tool.Id,
                Name = tool.Name,
                Description = tool.Description,
                BraveryBonus = tool.BraveryBonus,
                TrustBonus = tool.TrustBonus,
                PresenceBonus = tool.PresenceBonus,
                GrowthBonus = tool.GrowthBonus,
                CareBonus = tool.CareBonus
            };
            return Ok(viewModel);
        }

        // POST: api/Tool
        [HttpPost]
        public async Task<ActionResult<ToolViewModel>> PostTool([FromBody] ToolViewModel toolViewModel)
        {
            if (string.IsNullOrWhiteSpace(toolViewModel.Name))
            {
                return BadRequest(new { message = "Tool name (azonosító) is required."});
            }
            
            var tool = new Tool
            {
                Name = toolViewModel.Name,
                Description = toolViewModel.Description,
                BraveryBonus = toolViewModel.BraveryBonus,
                TrustBonus = toolViewModel.TrustBonus,
                PresenceBonus = toolViewModel.PresenceBonus,
                GrowthBonus = toolViewModel.GrowthBonus,
                CareBonus = toolViewModel.CareBonus
            };

            var createdTool = await _toolService.CreateTool(tool);

            var createdViewModel = new ToolViewModel
            {
                Id = createdTool.Id,
                Name = createdTool.Name,
                Description = createdTool.Description,
                BraveryBonus = createdTool.BraveryBonus,
                TrustBonus = createdTool.TrustBonus,
                PresenceBonus = createdTool.PresenceBonus,
                GrowthBonus = createdTool.GrowthBonus,
                CareBonus = createdTool.CareBonus
            };

            return CreatedAtAction(nameof(GetTool), new { id = createdTool.Id }, createdViewModel);
        }

        // PUT: api/Tool/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTool(int id, [FromBody] ToolViewModel toolViewModel)
        {
            if (id != toolViewModel.Id)
            {
                return BadRequest(new { message = "ID mismatch." });
            }

            if (string.IsNullOrWhiteSpace(toolViewModel.Name))
            {
                 return BadRequest(new { message = "Tool name (azonosító) is required." });
            }

            var toolToUpdate = await _toolService.GetToolById(id);
            if (toolToUpdate == null)
            {
                return NotFound();
            }

            toolToUpdate.Name = toolViewModel.Name;
            toolToUpdate.Description = toolViewModel.Description;
            toolToUpdate.BraveryBonus = toolViewModel.BraveryBonus;
            toolToUpdate.TrustBonus = toolViewModel.TrustBonus;
            toolToUpdate.PresenceBonus = toolViewModel.PresenceBonus;
            toolToUpdate.GrowthBonus = toolViewModel.GrowthBonus;
            toolToUpdate.CareBonus = toolViewModel.CareBonus;
            
            await _toolService.SaveChanges(); 

            return NoContent();
        }
    }
}