using Microsoft.AspNetCore.Mvc;

namespace EvoCharacterManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValakiController : ControllerBase
{
    [HttpGet("hello")]
    public IActionResult Hello() => Ok("Hello from ValakiController!");
}