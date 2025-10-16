using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService  _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("team-stats")]
        public async Task<IActionResult> GetTeamStats()
        {
            try
            {
                var teamStats = await _dashboardService.GetAverageTeamStats();
                return Ok(teamStats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while calculating team stats.");
            }
        }
        
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var summary = await _dashboardService.GetDashboardSummary();
                return Ok(summary);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while fetching dashboard summary.");
            }
        }
    }
}