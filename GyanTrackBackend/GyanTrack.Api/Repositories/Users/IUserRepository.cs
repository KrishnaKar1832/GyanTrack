using GyanTrack.Api.Models.Users;

namespace GyanTrack.Api.Repositories.Users
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(int id);
    }

    public interface IAdminRepository
    {
        Task<Admin?> GetByIdAsync(int id);
        Task<Admin?> GetByUserIdAsync(int userId);
        Task<IEnumerable<Admin>> GetAllAsync();
        Task<Admin> CreateAsync(Admin admin);
        Task<Admin> UpdateAsync(Admin admin);
        Task<bool> DeleteAsync(int id);
    }

    public interface IEvaluatorRepository
    {
        Task<Evaluator?> GetByIdAsync(int id);
        Task<Evaluator?> GetByUserIdAsync(int userId);
        Task<IEnumerable<Evaluator>> GetAllAsync();
        Task<IEnumerable<Evaluator>> GetByDepartmentAsync(string department);
        Task<Evaluator> CreateAsync(Evaluator evaluator);
        Task<Evaluator> UpdateAsync(Evaluator evaluator);
        Task<bool> DeleteAsync(int id);
    }

    public interface IInternRepository
    {
        Task<Intern?> GetByIdAsync(int id);
        Task<Intern?> GetByUserIdAsync(int userId);
        Task<Intern?> GetByInternWithUserAsync(int internId);
        Task<IEnumerable<Intern>> GetAllAsync();
        Task<IEnumerable<Intern>> GetByDepartmentAsync(string department);
        Task<IEnumerable<Intern>> GetByBatchAsync(string batch);
        Task<Intern> CreateAsync(Intern intern);
        Task<Intern> UpdateAsync(Intern intern);
        Task<bool> DeleteAsync(int id);
    }
}
