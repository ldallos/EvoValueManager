using Microsoft.EntityFrameworkCore;
using EvoCharacterManager.Data;
using EvoCharacterManager.Helpers;
using EvoCharacterManager.Services;
using Microsoft.Extensions.FileProviders;

namespace EvoCharacterManager
{
    public class Program
    {
        public static bool UseInMemory = true;

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
                
                var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
                seeder.SeedInitialData();
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
            builder.Services.AddTransient<IToolService, ToolService>();
            builder.Services.AddTransient<ICharacterToolService, CharacterToolService>();
            builder.Services.AddTransient<DatabaseSeeder>();
            builder.Services.AddTransient<NameGenerator>();
        }

        private static void ConfigureDatabase(WebApplicationBuilder builder)
        {
            UseInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase");
            if (UseInMemory)
            {
                builder.Services.AddDbContext<CharacterManagerContext>(options => options.UseInMemoryDatabase("TestDatabase"));
            }
            else
            {
                builder.Services.AddDbContext<CharacterManagerContext>(options => 
                    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
            }
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