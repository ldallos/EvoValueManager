using Microsoft.EntityFrameworkCore;
using EvoCharacterManager.Data;
using EvoCharacterManager.Helpers;
using EvoCharacterManager.Middleware;
using EvoCharacterManager.Services;
using Microsoft.Extensions.FileProviders;

namespace EvoCharacterManager
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            bool useInMemoryDb = builder.Configuration.GetValue<bool>("UseInMemoryDatabase");

            ConfigureServices(builder, useInMemoryDb);
            ConfigureDatabase(builder, useInMemoryDb);
            ConfigureMvc(builder);

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<CharacterManagerContext>();
                dbContext.Database.EnsureCreated();
                var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
                seeder.SeedInitialData();
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "../EvoValueManager.Client/dist")),
            });
            
            app.UseMiddleware<LocalizationMiddleware>();

            app.UseRouting();
            app.UseAuthorization();
            app.MapFallbackToFile("index.html");
            
            ConfigureEndpoints(app);

            app.Run();
        }

        private static void ConfigureServices(WebApplicationBuilder builder, bool useInMemoryDb)
        {
            builder.Services.AddTransient<ICharacterService, CharacterService>();
            builder.Services.AddTransient<IChallengeService, ChallengeService>();
            builder.Services.AddTransient<IManagementService, ManagementService>();
            builder.Services.AddTransient<IToolService, ToolService>();
            builder.Services.AddTransient<ICharacterToolService, CharacterToolService>();
            builder.Services.AddTransient<IDashboardService, DashboardService>();
            builder.Services.AddTransient<NameGenerator>();

            if (useInMemoryDb)
            {
                builder.Services.AddTransient<IDatabaseSeeder, InMemoryDatabaseSeeder>();
            }
            else
            {
                builder.Services.AddTransient<IDatabaseSeeder, DatabaseSeeder>();
            }
        }

        private static void ConfigureDatabase(WebApplicationBuilder builder, bool useInMemoryDb)
        {
            if (useInMemoryDb)
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