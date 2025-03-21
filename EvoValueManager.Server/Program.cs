using Microsoft.EntityFrameworkCore;
using EvoCharacterManager.Data;
using EvoCharacterManager.Services;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.SpaProxy;

namespace EvoCharacterManager
{
    public class Program
    {
        public static bool UseInMemory => true;

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            ConfigureServices(builder);
            ConfigureDatabase(builder);
            ConfigureMvc(builder);

            var app = builder.Build();

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
            builder.Services.AddDbContext<CharacterManagerContext>(options =>
                options.UseInMemoryDatabase("TestDatabase"));

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