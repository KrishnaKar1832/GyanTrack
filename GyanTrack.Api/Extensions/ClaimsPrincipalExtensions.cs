using System.Security.Claims;

namespace GyanTrack.Api.Extensions
{
    /// <summary>
    /// Extension methods for ClaimsPrincipal
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Get user ID from claims
        /// </summary>
        public static int GetUserId(this ClaimsPrincipal principal)
        {
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                              principal.FindFirst("userId")?.Value;
            
            if (int.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            
            throw new InvalidOperationException("User ID not found in claims");
        }

        /// <summary>
        /// Get user role from claims
        /// </summary>
        public static string GetUserRole(this ClaimsPrincipal principal)
        {
            return principal.FindFirst(ClaimTypes.Role)?.Value ?? "";
        }

        /// <summary>
        /// Check if user has specific role
        /// </summary>
        public static bool HasRole(this ClaimsPrincipal principal, string role)
        {
            return principal.IsInRole(role);
        }
    }
}
