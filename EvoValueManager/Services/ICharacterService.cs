using EvoCharacterManager.Models.Entities;

namespace EvoCharacterManager.Services
{
    public interface ICharacterService
    {
        Task<List<Character>> GetAllCharacters();

        Task<Character?> GetCharacterById(int id);

        Task SaveNewCharacter(Character character);

        Task SaveChanges();
    }
}
