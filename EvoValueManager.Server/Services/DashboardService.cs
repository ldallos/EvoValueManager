using EvoCharacterManager.Data;
using EvoCharacterManager.Dto;
using Microsoft.EntityFrameworkCore;
using EvoValueManager.Models.Shared;

namespace EvoCharacterManager.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly CharacterManagerContext _context;
        private readonly ICharacterService _characterService;

        public DashboardService(CharacterManagerContext context, ICharacterService characterService)
        {
            _context = context;
            _characterService = characterService;
        }

        public async Task<List<TeamStatViewModel>> GetAverageTeamStats()
        {
            var effectiveCharacters = await _characterService.GetEffectiveCharacters();

            if (effectiveCharacters.Count == 0)
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

            var averageBravery = effectiveCharacters.Average(c => c.Bravery);
            var averageTrust = effectiveCharacters.Average(c => c.Trust);
            var averagePresence = effectiveCharacters.Average(c => c.Presence);
            var averageGrowth = effectiveCharacters.Average(c => c.Growth);
            var averageCare = effectiveCharacters.Average(c => c.Care);

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
        
        public async Task<DashboardSummaryDto> GetDashboardSummary()
        {
            string inProgressState = Resources.ChallengeState_InProgress; 
            var challengesInProgress = await _context.Managements
                .CountAsync(m => !m.IsClosed && m.StateId == 2);

            var mostEquippedToolQuery = await _context.CharacterTools
                .GroupBy(ct => ct.Tool.Name)
                .Select(g => new { ToolName = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .FirstOrDefaultAsync();
            
            var mostEquippedTool = mostEquippedToolQuery?.ToolName;

            string completedState = Resources.ChallengeState_Completed;
            var topContributorQuery = await _context.Managements
                .Where(m => m.StateId == 3)
                .GroupBy(m => m.CharacterId)
                .Select(g => new { CharacterId = g.Key, CompletedCount = g.Count() })
                .OrderByDescending(x => x.CompletedCount)
                .FirstOrDefaultAsync();

            string? topContributorName = "N/A";
            if (topContributorName == null) throw new ArgumentNullException(nameof(topContributorName));
            if (topContributorQuery == null)
                return new DashboardSummaryDto
                {
                    ChallengesInProgress = challengesInProgress,
                    MostEquippedTool = mostEquippedTool,
                    TopContributor = topContributorName
                };
            var character = await _context.Characters.FindAsync(topContributorQuery.CharacterId);
            topContributorName = character?.Name ?? "N/A";

            return new DashboardSummaryDto
            {
                ChallengesInProgress = challengesInProgress,
                MostEquippedTool = mostEquippedTool,
                TopContributor = topContributorName
            };
        }
    }
}
