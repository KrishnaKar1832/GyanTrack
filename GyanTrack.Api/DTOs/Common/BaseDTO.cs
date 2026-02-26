namespace GyanTrack.Api.DTOs.Common
{
    /// <summary>
    /// Base DTO for common properties
    /// </summary>
    public abstract class BaseDTO
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
