using EvoCharacterManager.Helpers;

namespace EvoCharacterManager.Data
{
    public class DatabaseSeeder : IDatabaseSeeder
    {
        private readonly CharacterManagerContext _context;

        public DatabaseSeeder(CharacterManagerContext context)
        {
            _context = context;
        }

        public void SeedInitialData()
        {
            SeedDataHelper.Seed(_context);
        }

        public void ResetDatabase()
        {
            _context.Managements.RemoveRange(_context.Managements);
            _context.CharacterTools.RemoveRange(_context.CharacterTools);
            _context.CharacterAchievements.RemoveRange(_context.CharacterAchievements);
            _context.Characters.RemoveRange(_context.Characters);
            _context.Challenges.RemoveRange(_context.Challenges);
            _context.Tools.RemoveRange(_context.Tools);
            _context.Achievements.RemoveRange(_context.Achievements);

            _context.SaveChanges();

            SeedInitialData();
        }
    }
}