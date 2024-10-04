using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Services
{
    public class CharacterService : ICharacterService
    {
        public CharacterService(CharacterManagerContext context)
        {
            myContext = context;
            context.Database.EnsureCreated();
        }

        public async Task<List<Character>> GetAllCharacters()
        {
            return await myContext.Characters.ToListAsync();
        }

        public async Task<Character?> GetCharacterById(int id)
        {
            return await myContext.Characters.FindAsync(id);
        }

        public async Task SaveNewCharacter(Character character)
        {
            await myContext.Characters.AddAsync(character);
            await myContext.SaveChangesAsync();
        }

        public async Task SaveChanges()
        {
            await myContext.SaveChangesAsync();
        }

        private readonly CharacterManagerContext myContext;
    }
}
