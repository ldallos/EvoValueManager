using Microsoft.AspNetCore.Mvc;
using EvoCharacterManager.Data;

namespace EvoCharacterManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IDatabaseSeeder _seeder;

        public DebugController(IWebHostEnvironment env, IDatabaseSeeder seeder)
        {
            _env = env;
            _seeder = seeder;
        }

        [HttpPost("reset-database")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult ResetDatabase()
        {
            if (!_env.IsDevelopment())
            {
                return Forbid("This action is only available in the Development environment.");
            }

            try
            {
                _seeder.ResetDatabase();
                return Ok(new { message = "Database has been successfully reset to its initial state." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An unexpected error occurred during reset: {ex.Message}" });
            }
        }
    }
}