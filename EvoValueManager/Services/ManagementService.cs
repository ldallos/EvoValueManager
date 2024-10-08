﻿using EvoCharacterManager.Data;
using EvoCharacterManager.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoCharacterManager.Services
{
    public class ManagementService : IManagementService
    {
        public ManagementService(CharacterManagerContext context, IChallengeService challengeService)
        {
            myContext = context;
            myChallengeService = challengeService;
            context.Database.EnsureCreated();
        }

        public async Task AssignChallenge(int characterId, int challengeId)
        {
            await myContext.Managements.AddAsync(
                new Management
                {
                    CharacterId = characterId,
                    ChallangeId = challengeId,
                    State = "Assigned"
                }
            );
        }

        public async Task<List<Challenge>> GetAssignedChallenges(int characterId)
        {
            List<Management> mangagements = await myContext.Managements.Where(management =>
                management.CharacterId == characterId).ToListAsync();

            List<Challenge> challenges = new List<Challenge>();
            foreach (Management management in mangagements)
            {
                Challenge? challange = await myChallengeService.GetChallengeById(management.ChallangeId);
                if (challange != null)
                {
                    challenges.Add(challange);
                }
            }

            return challenges;
        }

        public async Task RemoveManagement(int characterId, int challengeId)
        {
            Management management = await myContext.Managements.SingleAsync(management =>
                management.CharacterId == characterId && management.ChallangeId == challengeId);

            myContext.Managements.Remove(management);
        }

        public async Task SaveChanges()
        {
            await myContext.SaveChangesAsync();
        }

        private readonly CharacterManagerContext myContext;
        private readonly IChallengeService myChallengeService;
    }
}
