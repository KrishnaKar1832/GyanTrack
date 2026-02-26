using GyanTrack.Api.Models.Users;
using GyanTrack.Api.Models.Evaluations;
using GyanTrack.Api.Models.Assessments;

namespace GyanTrack.Api.Data
{
    public static class SeedData
    {
        public static async Task SeedDummyDataAsync(GyanTrackDbContext context)
        {
            // Check if data already exists
            if (context.Users.Any())
                return;

            // Create Users
            var adminUser = new User
            {
                Email = "admin@gyantrack.com",
                PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("admin123")),
                Role = UserRole.Admin
            };
            context.Users.Add(adminUser);

            var evaluatorUser = new User
            {
                Email = "evaluator@gyantrack.com",
                PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("evaluator123")),
                Role = UserRole.Evaluator
            };
            context.Users.Add(evaluatorUser);

            var evaluatorUser2 = new User
            {
                Email = "evaluator2@gyantrack.com",
                PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("evaluator123")),
                Role = UserRole.Evaluator
            };
            context.Users.Add(evaluatorUser2);

            var internUser = new User
            {
                Email = "intern@gyantrack.com",
                PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("intern123")),
                Role = UserRole.Intern
            };
            context.Users.Add(internUser);

            var internUser2 = new User
            {
                Email = "intern2@gyantrack.com",
                PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("intern123")),
                Role = UserRole.Intern
            };
            context.Users.Add(internUser2);

            var internUser3 = new User
            {
                Email = "intern3@gyantrack.com",
                PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("intern123")),
                Role = UserRole.Intern
            };
            context.Users.Add(internUser3);

            await context.SaveChangesAsync();

            // Create Admins
            var admin = new Admin
            {
                AdminID = adminUser.Id,
                FullName = "System Admin"
            };
            context.Admins.Add(admin);

            // Create Evaluators
            var evaluator = new Evaluator
            {
                EvaluatorID = evaluatorUser.Id,
                FullName = "John Smith",
                Department = "Computer Science"
            };
            context.Evaluators.Add(evaluator);

            var evaluator2 = new Evaluator
            {
                EvaluatorID = evaluatorUser2.Id,
                FullName = "Sarah Johnson",
                Department = "Information Technology"
            };
            context.Evaluators.Add(evaluator2);

            // Create Interns
            var intern = new Intern
            {
                InternID = internUser.Id,
                FullName = "Alice Brown",
                Department = "Computer Science",
                Batch = "2024"
            };
            context.Interns.Add(intern);

            var intern2 = new Intern
            {
                InternID = internUser2.Id,
                FullName = "Bob Wilson",
                Department = "Computer Science",
                Batch = "2024"
            };
            context.Interns.Add(intern2);

            var intern3 = new Intern
            {
                InternID = internUser3.Id,
                FullName = "Charlie Davis",
                Department = "Information Technology",
                Batch = "2024"
            };
            context.Interns.Add(intern3);

            await context.SaveChangesAsync();

            // Create Subjects
            var subjects = new List<Subject>
            {
                new Subject { SubjectName = "Java" },
                new Subject { SubjectName = "Python" },
                new Subject { SubjectName = "DBMS" },
                new Subject { SubjectName = "Cloud" },
                new Subject { SubjectName = "AI" },
                new Subject { SubjectName = "DotNET" }
            };
            context.Subjects.AddRange(subjects);
            await context.SaveChangesAsync();

            // Create Assignment Templates
            var template1 = new AssignmentTemplate
            {
                SubjectID = subjects.First(s => s.SubjectName == "Java").Id,
                EvaluatorID = evaluator.EvaluatorID,
                TechnicalWeight = 70,
                CommunicationWeight = 20,
                AttendanceWeight = 10,
                CreatedBy = admin.AdminID
            };
            context.AssignmentTemplates.Add(template1);

            var template2 = new AssignmentTemplate
            {
                SubjectID = subjects.First(s => s.SubjectName == "Python").Id,
                EvaluatorID = evaluator.EvaluatorID,
                TechnicalWeight = 60,
                CommunicationWeight = 25,
                AttendanceWeight = 15,
                CreatedBy = admin.AdminID
            };
            context.AssignmentTemplates.Add(template2);

            var template3 = new AssignmentTemplate
            {
                SubjectID = subjects.First(s => s.SubjectName == "DotNET").Id,
                EvaluatorID = evaluator2.EvaluatorID,
                TechnicalWeight = 65,
                CommunicationWeight = 20,
                AttendanceWeight = 15,
                CreatedBy = admin.AdminID
            };
            context.AssignmentTemplates.Add(template3);

            await context.SaveChangesAsync();

            // Create Evaluator-Intern Mappings
            var mappings = new List<EvaluatorIntern>
            {
                new EvaluatorIntern { EvaluatorID = evaluator.EvaluatorID, InternID = intern.InternID },
                new EvaluatorIntern { EvaluatorID = evaluator.EvaluatorID, InternID = intern2.InternID },
                new EvaluatorIntern { EvaluatorID = evaluator2.EvaluatorID, InternID = intern3.InternID }
            };
            context.EvaluatorInterns.AddRange(mappings);
            await context.SaveChangesAsync();

            // Create Tests
            var now = DateTime.UtcNow;
            var test1 = new Test
            {
                TemplateID = template1.Id,
                Title = "Java Fundamentals Test",
                StartTime = now.AddDays(-7),
                EndTime = now.AddDays(7),
                DurationMinutes = 30,
                CreatedBy = evaluator.EvaluatorID
            };
            context.Tests.Add(test1);

            var test2 = new Test
            {
                TemplateID = template2.Id,
                Title = "Python Programming Test",
                StartTime = now.AddDays(1),
                EndTime = now.AddDays(2),
                DurationMinutes = 45,
                CreatedBy = evaluator.EvaluatorID
            };
            context.Tests.Add(test2);

            await context.SaveChangesAsync();

            // Create Questions and Options for Test 1
            var question1 = new Question
            {
                TestID = test1.Id,
                QuestionText = "What is the default value of an int in Java?",
                Marks = 10
            };
            context.Questions.Add(question1);

            await context.SaveChangesAsync();

            var options1 = new List<Option>
            {
                new Option { QuestionID = question1.Id, OptionText = "0", IsCorrect = true },
                new Option { QuestionID = question1.Id, OptionText = "1", IsCorrect = false },
                new Option { QuestionID = question1.Id, OptionText = "null", IsCorrect = false },
                new Option { QuestionID = question1.Id, OptionText = "undefined", IsCorrect = false }
            };
            context.Options.AddRange(options1);

            var question2 = new Question
            {
                TestID = test1.Id,
                QuestionText = "Which keyword is used to inherit a class in Java?",
                Marks = 10
            };
            context.Questions.Add(question2);

            await context.SaveChangesAsync();

            var options2 = new List<Option>
            {
                new Option { QuestionID = question2.Id, OptionText = "extends", IsCorrect = true },
                new Option { QuestionID = question2.Id, OptionText = "implements", IsCorrect = false },
                new Option { QuestionID = question2.Id, OptionText = "inherits", IsCorrect = false },
                new Option { QuestionID = question2.Id, OptionText = "super", IsCorrect = false }
            };
            context.Options.AddRange(options2);

            await context.SaveChangesAsync();

            // Create Test Attempt
            var attempt1 = new TestAttempt
            {
                TestID = test1.Id,
                InternID = intern.InternID,
                StartTime = now.AddDays(-5),
                EndTime = now.AddDays(-5).AddMinutes(25),
                Score = 80,
                IsSubmitted = true
            };
            context.TestAttempts.Add(attempt1);
            await context.SaveChangesAsync();

            // Create Answers for attempt
            var answer1 = new Answer
            {
                AttemptID = attempt1.Id,
                QuestionID = question1.Id,
                SelectedOptionID = options1[0].OptionID,
                IsCorrect = true,
                MarksAwarded = 10
            };
            context.Answers.Add(answer1);

            var answer2 = new Answer
            {
                AttemptID = attempt1.Id,
                QuestionID = question2.Id,
                SelectedOptionID = options2[0].OptionID,
                IsCorrect = true,
                MarksAwarded = 10
            };
            context.Answers.Add(answer2);
            await context.SaveChangesAsync();

            // Create Performance Scores
            var score1 = new PerformanceScore
            {
                InternID = intern.InternID,
                TemplateID = template1.Id,
                TechnicalScore = 85,
                CommunicationScore = 75,
                AttendanceScore = 90,
                EvaluatorID = evaluator.EvaluatorID
            };
            context.PerformanceScores.Add(score1);

            var score2 = new PerformanceScore
            {
                InternID = intern2.InternID,
                TemplateID = template1.Id,
                TechnicalScore = 70,
                CommunicationScore = 80,
                AttendanceScore = 85,
                EvaluatorID = evaluator.EvaluatorID
            };
            context.PerformanceScores.Add(score2);

            var score3 = new PerformanceScore
            {
                InternID = intern3.InternID,
                TemplateID = template3.Id,
                TechnicalScore = 78,
                CommunicationScore = 82,
                AttendanceScore = 88,
                EvaluatorID = evaluator2.EvaluatorID
            };
            context.PerformanceScores.Add(score3);

            await context.SaveChangesAsync();
        }
    }
}
