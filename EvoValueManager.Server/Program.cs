using Microsoft.EntityFrameworkCore;
using EvoCharacterManager.Data;
using EvoCharacterManager.Services;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.SpaProxy;

namespace EvoCharacterManager
{
    public class Program
    {
        public static bool UseInMemory => false;

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            ConfigureServices(builder);
            ConfigureDatabase(builder);
            ConfigureMvc(builder);

            var app = builder.Build();
            
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<CharacterManagerContext>();
                dbContext.Database.EnsureCreated(); // létrehozzuk a táblákat
                DatabaseSeeder.SeedInitialData(dbContext); //adatok betöltése ha üres az adatbázis
            }
            

            ConfigureMiddleware(app, builder);
            ConfigureEndpoints(app);

            app.Run();
        }

        private static void ConfigureServices(WebApplicationBuilder builder)
        {
            builder.Services.AddTransient<ICharacterService, CharacterService>();
            builder.Services.AddTransient<IChallengeService, ChallengeService>();
            builder.Services.AddTransient<IManagementService, ManagementService>();
        }

        private static void ConfigureDatabase(WebApplicationBuilder builder)
        {
            // builder.Services.AddDbContext<CharacterManagerContext>(options => options.UseInMemoryDatabase("TestDatabase"));
            builder.Services.AddDbContext<CharacterManagerContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
        }

        private static void ConfigureMvc(WebApplicationBuilder builder)
        {
            builder.Services.AddControllersWithViews();
        }

        private static void ConfigureMiddleware(WebApplication app, WebApplicationBuilder builder)
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "../EvoValueManager.Client/dist")),
            });
            app.UseRouting();
            app.UseAuthorization();

            app.MapFallbackToFile("index.html");
        }

        private static void ConfigureEndpoints(WebApplication app)
        {
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
        }
    }
}