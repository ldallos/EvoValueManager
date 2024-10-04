using Microsoft.EntityFrameworkCore;
using EvoCharacterManager.Data;
using EvoCharacterManager.Services;

namespace EvoCharacterManager
{
    public class Program
    {
        public static bool UseInMemory { get; private set; }

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddTransient<ICharacterService, CharacterService>();
            builder.Services.AddTransient<IChallengeService, ChallengeService>();
            builder.Services.AddTransient<IManagementService, ManagementService>();

            UseInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase");
            if (UseInMemory)
            {
                builder.Services.AddDbContext<CharacterManagerContext>(options =>
                    options.UseInMemoryDatabase("TestDatabase"));
            }
            else
            {
                builder.Services.AddDbContext<CharacterManagerContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            }

            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
