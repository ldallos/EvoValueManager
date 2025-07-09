using EvoCharacterManager.Dto;

namespace EvoCharacterManager.Services
{
    public interface IDashboardService
    {
        Task<List<TeamStatViewModel>> GetAverageTeamStats();
        
        Task<DashboardSummaryDto> GetDashboardSummary(); 
    }
}