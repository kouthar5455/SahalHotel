using System.Net;
using System.Text.Json;

namespace HotelBookingAPI.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            var statusCode = ex switch
            {
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                UnauthorizedAccessException => (int)HttpStatusCode.Forbidden,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                _ => (int)HttpStatusCode.InternalServerError
            };

            context.Response.StatusCode = statusCode;

            // Never expose raw exception details for unexpected (500) errors outside
            // Development — they can leak SQL, connection strings or stack details.
            var message = statusCode == (int)HttpStatusCode.InternalServerError && !_env.IsDevelopment()
                ? "An unexpected error occurred. Please try again later."
                : ex.Message;

            var response = new
            {
                success = false,
                message,
                statusCode
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}