namespace EvoCharacterManager.Dto
{
    public class AssignChallengePayload
    {
        public int CharacterId { get; set; }
        public int ChallengeId { get; set; }
        public int StateId { get; set; }
        public string? Details { get; set; }
    }
    
    public class UpdateManagementPayload
    {
        public int StateId { get; set; }
        public string? Details { get; set; }
    }
    
    public class ManagementDetailsViewModel
    {
        public string State { get; set; } = string.Empty;
        public string? Details { get; set; }
        public bool IsClosed { get; set; }
    }
}