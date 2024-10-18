namespace EvoCharacterManager.Models.ViewModels
{
    public class CharacterViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int Bravery { get; set; }

        public int Trust { get; set; }

        public int Presence { get; set; }
        
        public int Growth { get; set; }
        
        public int Care { get; set; }
    }
}
