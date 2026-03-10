using System.Linq.Expressions;

namespace GyanTrack.Api.Repositories.Common
{
    /// <summary>
    /// Base repository interface
    /// </summary>
    public interface IBaseRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<bool> DeleteAsync(int id);
        Task<int> SaveChangesAsync();
    }
}
