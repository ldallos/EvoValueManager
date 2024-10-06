using EvoCharacterManager.Controllers;
using EvoCharacterManager.Models.Entities;
using EvoCharacterManager.Models.ViewModels;
using EvoCharacterManager.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace EvoValueManager.Tests
{
    [TestFixture]
    public class CharacterControllerTests
    {
        [Test]
        public async Task CharacterTest_WithNullParameters()
        {
            // Preparation
            var characterList = new List<Character>
            { 
                new Character { ID = 1, Name = "Char1" },
                new Character { ID = 2, Name = "Char2" }
            };

            var mockService = new Mock<ICharacterService>();
            mockService.Setup(service => service.GetAllCharacters()).ReturnsAsync(characterList);

            // Action
            CharacterController controller = new CharacterController(mockService.Object);
            var result = (ViewResult)await controller.Character(null, null);

            // Verification
            Assert.That(result.Model, Is.TypeOf<CharacterPageViewModel>());

            var model = (CharacterPageViewModel)result.Model;
            Assert.That(model.SelectedCharacterId, Is.EqualTo(0));
            Assert.That(model.SelectedCharacter, Is.Null);
            Assert.That(model.AddCharacter, Is.False);
        }
    }
}