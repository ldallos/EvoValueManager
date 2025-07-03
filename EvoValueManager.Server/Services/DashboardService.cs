using EvoCharacterManager.Data;
using EvoCharacterManager.Dto;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly CharacterManagerContext _context;

        public DashboardService(CharacterManagerContext context)
        {
            _context = context;
        }

        public async Task<List<TeamStatViewModel>> GetAverageTeamStats()
        {
            var characterCount = await _context.Characters.CountAsync();

            if (characterCount == 0)
            {
                return new List<TeamStatViewModel>
                {
                    new() { Subject = "Bravery", Average = 0 },
                    new() { Subject = "Trust", Average = 0 },
                    new() { Subject = "Presence", Average = 0 },
                    new() { Subject = "Growth", Average = 0 },
                    new() { Subject = "Care", Average = 0 },
                };
            }

            var averageBravery = await _context.Characters.AverageAsync(c => c.Bravery);
            var averageTrust = await _context.Characters.AverageAsync(c => c.Trust);
            var averagePresence = await _context.Characters.AverageAsync(c => c.Presence);
            var averageGrowth = await _context.Characters.AverageAsync(c => c.Growth);
            var averageCare = await _context.Characters.AverageAsync(c => c.Care);

            var teamStats = new List<TeamStatViewModel>
            {
                new() { Subject = "Bravery", Average = Math.Round(averageBravery, 1) },
                new() { Subject = "Trust", Average = Math.Round(averageTrust, 1) },
                new() { Subject = "Presence", Average = Math.Round(averagePresence, 1) },
                new() { Subject = "Growth", Average = Math.Round(averageGrowth, 1) },
                new() { Subject = "Care", Average = Math.Round(averageCare, 1) }
            };

            return teamStats;
        }
    }
}