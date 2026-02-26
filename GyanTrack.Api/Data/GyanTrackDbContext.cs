using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using GyanTrack.Api.Models.Users;
using GyanTrack.Api.Models.Evaluations;
using GyanTrack.Api.Models.Assessments;
using Microsoft.EntityFrameworkCore.Design;

namespace GyanTrack.Api.Data
{
    /// <summary>
    /// Entity Framework DbContext for GyanTrack application
    /// </summary>
    public class GyanTrackDbContext : DbContext
    {
        public GyanTrackDbContext(DbContextOptions<GyanTrackDbContext> options) 
            : base(options)
        {
        }

        // DbSets for Users
        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Evaluator> Evaluators { get; set; }
        public DbSet<Intern> Interns { get; set; }

        // DbSets for Evaluations
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<AssignmentTemplate> AssignmentTemplates { get; set; }
        public DbSet<EvaluatorIntern> EvaluatorInterns { get; set; }
        public DbSet<PerformanceScore> PerformanceScores { get; set; }
        public DbSet<EvaluatorRemark> EvaluatorRemarks { get; set; }

        // DbSets for Assessments
        public DbSet<Test> Tests { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<TestAttempt> TestAttempts { get; set; }
        public DbSet<Answer> Answers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========== USER CONFIGURATIONS ==========

            // User - Role enum conversion
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>()
                .HasMaxLength(20);

            // User - Unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ========== ADMIN CONFIGURATIONS ==========

            // Admin -> User (One-to-One)
            modelBuilder.Entity<Admin>()
                .HasOne(a => a.User)
                .WithOne(u => u.Admin)
                .HasForeignKey<Admin>(a => a.AdminID);

            // ========== EVALUATOR CONFIGURATIONS ==========

            // Evaluator -> User (One-to-One)
            modelBuilder.Entity<Evaluator>()
                .HasOne(e => e.User)
                .WithOne(u => u.Evaluator)
                .HasForeignKey<Evaluator>(e => e.EvaluatorID);

            // ========== INTERN CONFIGURATIONS ==========

            // Intern -> User (One-to-One)
            modelBuilder.Entity<Intern>()
                .HasOne(i => i.User)
                .WithOne(u => u.Intern)
                .HasForeignKey<Intern>(i => i.InternID);

            // ========== SUBJECT CONFIGURATIONS ==========

            // Subject - Unique SubjectName
            modelBuilder.Entity<Subject>()
                .HasIndex(s => s.SubjectName)
                .IsUnique();

            // ========== ASSIGNMENT TEMPLATE CONFIGURATIONS ==========

            // AssignmentTemplate - Weightage check constraint
            modelBuilder.Entity<AssignmentTemplate>()
                .ToTable(t => t.HasCheckConstraint(
                    "CK_Weightage_Sum", 
                    "TechnicalWeight + CommunicationWeight + AttendanceWeight = 100"));

            // AssignmentTemplate -> Subject (Many-to-One)
            modelBuilder.Entity<AssignmentTemplate>()
                .HasOne(at => at.Subject)
                .WithMany(s => s.AssignmentTemplates)
                .HasForeignKey(at => at.SubjectID)
                .OnDelete(DeleteBehavior.Restrict);

            // AssignmentTemplate -> Evaluator (Many-to-One)
            modelBuilder.Entity<AssignmentTemplate>()
                .HasOne(at => at.Evaluator)
                .WithMany(e => e.AssignedTemplates)
                .HasForeignKey(at => at.EvaluatorID)
                .OnDelete(DeleteBehavior.Restrict);

            // AssignmentTemplate -> Admin (Many-to-One)
            modelBuilder.Entity<AssignmentTemplate>()
                .HasOne(at => at.CreatedByAdmin)
                .WithMany(a => a.CreatedTemplates)
                .HasForeignKey(at => at.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // ========== EVALUATOR-INTERN MAPPING CONFIGURATIONS ==========

            // EvaluatorIntern -> Evaluator (Many-to-One)
            modelBuilder.Entity<EvaluatorIntern>()
                .HasOne(ei => ei.Evaluator)
                .WithMany(e => e.AssignedInterns)
                .HasForeignKey(ei => ei.EvaluatorID)
                .OnDelete(DeleteBehavior.Restrict);

            // EvaluatorIntern -> Intern (Many-to-One)
            modelBuilder.Entity<EvaluatorIntern>()
                .HasOne(ei => ei.Intern)
                .WithMany(i => i.AssignedEvaluators)
                .HasForeignKey(ei => ei.InternID)
                .OnDelete(DeleteBehavior.Restrict);

            // EvaluatorIntern - Unique constraint (Evaluator + Intern)
            modelBuilder.Entity<EvaluatorIntern>()
                .HasIndex(ei => new { ei.EvaluatorID, ei.InternID })
                .IsUnique();

            // ========== PERFORMANCE SCORE CONFIGURATIONS ==========

            // PerformanceScore -> Intern (Many-to-One)
            modelBuilder.Entity<PerformanceScore>()
                .HasOne(ps => ps.Intern)
                .WithMany(i => i.PerformanceScores)
                .HasForeignKey(ps => ps.InternID)
                .OnDelete(DeleteBehavior.Restrict);

            // PerformanceScore -> AssignmentTemplate (Many-to-One)
            modelBuilder.Entity<PerformanceScore>()
                .HasOne(ps => ps.Template)
                .WithMany(at => at.PerformanceScores)
                .HasForeignKey(ps => ps.TemplateID)
                .OnDelete(DeleteBehavior.Restrict);

            // PerformanceScore -> Evaluator (Many-to-One)
            modelBuilder.Entity<PerformanceScore>()
                .HasOne(ps => ps.Evaluator)
                .WithMany(e => e.PerformanceScores)
                .HasForeignKey(ps => ps.EvaluatorID)
                .OnDelete(DeleteBehavior.Restrict);

            // ========== EVALUATOR REMARK CONFIGURATIONS ==========

            // EvaluatorRemark -> TestAttempt (Many-to-One)
            modelBuilder.Entity<EvaluatorRemark>()
                .HasOne(er => er.TestAttempt)
                .WithMany(ta => ta.EvaluatorRemarks)
                .HasForeignKey(er => er.AttemptID)
                .OnDelete(DeleteBehavior.Restrict);

            // EvaluatorRemark -> Evaluator (Many-to-One)
            modelBuilder.Entity<EvaluatorRemark>()
                .HasOne(er => er.Evaluator)
                .WithMany(e => e.GivenRemarks)
                .HasForeignKey(er => er.EvaluatorID)
                .OnDelete(DeleteBehavior.Restrict);

            // ========== TEST CONFIGURATIONS ==========

            // Test -> AssignmentTemplate (Many-to-One)
            modelBuilder.Entity<Test>()
                .HasOne(t => t.Template)
                .WithMany(at => at.Tests)
                .HasForeignKey(t => t.TemplateID)
                .OnDelete(DeleteBehavior.Restrict);

            // Test -> Evaluator (Many-to-One)
            modelBuilder.Entity<Test>()
                .HasOne(t => t.CreatedByEvaluator)
                .WithMany(e => e.CreatedTests)
                .HasForeignKey(t => t.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // ========== QUESTION CONFIGURATIONS ==========

            // Question -> Test (Many-to-One)
            modelBuilder.Entity<Question>()
                .HasOne(q => q.Test)
                .WithMany(t => t.Questions)
                .HasForeignKey(q => q.TestID)
                .OnDelete(DeleteBehavior.Cascade);

            // ========== OPTION CONFIGURATIONS ==========

            // Option -> Question (Many-to-One)
            modelBuilder.Entity<Option>()
                .HasOne(o => o.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionID)
                .OnDelete(DeleteBehavior.Cascade);

            // ========== TEST ATTEMPT CONFIGURATIONS ==========

            // TestAttempt -> Test (Many-to-One)
            modelBuilder.Entity<TestAttempt>()
                .HasOne(ta => ta.Test)
                .WithMany(t => t.TestAttempts)
                .HasForeignKey(ta => ta.TestID)
                .OnDelete(DeleteBehavior.Restrict);

            // TestAttempt -> Intern (Many-to-One)
            modelBuilder.Entity<TestAttempt>()
                .HasOne(ta => ta.Intern)
                .WithMany(i => i.TestAttempts)
                .HasForeignKey(ta => ta.InternID)
                .OnDelete(DeleteBehavior.Restrict);

            // ========== ANSWER CONFIGURATIONS ==========

            // Answer -> TestAttempt (Many-to-One)
            modelBuilder.Entity<Answer>()
                .HasOne(a => a.TestAttempt)
                .WithMany(ta => ta.Answers)
                .HasForeignKey(a => a.AttemptID)
                .OnDelete(DeleteBehavior.Cascade);

            // Answer -> Question (Many-to-One)
            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionID)
                .OnDelete(DeleteBehavior.Restrict);

            // Answer -> Option (Many-to-One)
            modelBuilder.Entity<Answer>()
                .HasOne(a => a.SelectedOption)
                .WithMany(o => o.Answers)
                .HasForeignKey(a => a.SelectedOptionID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    /// <summary>
    /// Design-time factory for DbContext migrations
    /// </summary>
    [DbContext(typeof(GyanTrackDbContext))]
    public class GyanTrackDbContextFactory : IDesignTimeDbContextFactory<GyanTrackDbContext>
    {
        public GyanTrackDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<GyanTrackDbContext>();
optionsBuilder.UseSqlServer("Server=IN-CNNGR24;Database=GyanTrackDB;User Id=sa;Password=sa;Encrypt=True;TrustServerCertificate=True");
            
            return new GyanTrackDbContext(optionsBuilder.Options);
        }
    }
}
