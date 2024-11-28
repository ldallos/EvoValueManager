namespace EvoCharacterManager.Models.ViewModels
{
    public class CharacterViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int Bravery { get; set; } = 1;

        public int Trust { get; set; } = 1;

        public int Presence { get; set; } = 1;

        public int Growth { get; set; } = 1;
        
        public int Care { get; set; } = 1;
    }
}
