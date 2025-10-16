using System.Globalization;

namespace EvoCharacterManager.Middleware
{
    public class LocalizationMiddleware
    {
        private readonly RequestDelegate _next;

        public LocalizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var supportedCultures = new[] { "en-US", "hu-HU" };
            var defaultCulture = "en-US";

            var acceptLanguage = context.Request.Headers["Accept-Language"].ToString();
            var requestedCulture = acceptLanguage.Split(',').FirstOrDefault()?.Trim() ?? defaultCulture;

            var culture = supportedCultures.FirstOrDefault(c => c.StartsWith(requestedCulture.Split('-')[0])) ?? defaultCulture;

            var cultureInfo = new CultureInfo(culture);
            CultureInfo.CurrentCulture = cultureInfo;
            CultureInfo.CurrentUICulture = cultureInfo;

            await _next(context);
        }
    }
}