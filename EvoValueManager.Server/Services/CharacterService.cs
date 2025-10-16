using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Services
{
    public class CharacterService : ICharacterService
    {
        private readonly CharacterManagerContext myContext;

        public CharacterService(CharacterManagerContext context)
        {
            myContext = context;
        }

        public async Task<List<Character>> GetAllCharacters()
        {
            return await myContext.Characters.AsNoTracking().ToListAsync();
        }

        public async Task<List<Character>> GetEffectiveCharacters()
        {
            var charactersTask = myContext.Characters.AsNoTracking().ToListAsync();
            var assignmentsTask = myContext.CharacterTools
                .Include(ct => ct.Tool)
                .AsNoTracking()
                .ToListAsync();

            await Task.WhenAll(charactersTask, assignmentsTask);

            var characters = await charactersTask;
            var assignments = await assignmentsTask;

            var assignmentsByCharId = assignments.ToLookup(a => a.CharacterId);

            var effectiveCharacters = new List<Character>();

            foreach (var effectiveCharacter in characters.Select(baseCharacter => new Character
                     {
                         ID = baseCharacter.ID,
                         Name = baseCharacter.Name,
                         Title = baseCharacter.Title,
                         AvatarImage = baseCharacter.AvatarImage,
                         AvatarImageType = baseCharacter.AvatarImageType,
                         Bravery = baseCharacter.Bravery,
                         Trust = baseCharacter.Trust,
                         Presence = baseCharacter.Presence,
                         Growth = baseCharacter.Growth,
                         Care = baseCharacter.Care
                     }))
            {
                if (assignmentsByCharId.Contains(effectiveCharacter.ID))
                {
                    foreach (var assignment in assignmentsByCharId[effectiveCharacter.ID])
                    {
                        var tool = assignment.Tool;
                        if (tool == null) continue;
                        effectiveCharacter.Bravery += tool.BraveryBonus ?? 0;
                        effectiveCharacter.Trust += tool.TrustBonus ?? 0;
                        effectiveCharacter.Presence += tool.PresenceBonus ?? 0;
                        effectiveCharacter.Growth += tool.GrowthBonus ?? 0;
                        effectiveCharacter.Care += tool.CareBonus ?? 0;
                    }
                }
                effectiveCharacters.Add(effectiveCharacter);
            }
            return effectiveCharacters;
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

        public async Task DeleteCharacterAsync(int id)
        {
            var character = await myContext.Characters.FindAsync(id);
            if (character != null)
            {
                myContext.Characters.Remove(character);
                await myContext.SaveChangesAsync();
            }
        }

        public async Task SaveChanges()
        {
            await myContext.SaveChangesAsync();
        }
    }
}