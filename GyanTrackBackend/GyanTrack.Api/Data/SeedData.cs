using GyanTrack.Api.Models.Users;
using GyanTrack.Api.Models.Evaluations;
using GyanTrack.Api.Models.Assessments;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GyanTrack.Api.Data
{
    public static class SeedData
    {
        public static async Task SeedDummyDataAsync(GyanTrackDbContext context)
        {
            // Check if data already exists
            if (await context.Users.AnyAsync())
                return;

            var random = new Random(12345); // For reproducibility

            // --- DEPARTMENTS AND SUBJECTS ---
            var departments = new[] { "Computer Science", "Information Technology", "Electronics", "Mechanical" };
            var subjectNames = new[] { "Java", "Python", "DBMS", "Cloud Computing", "Artificial Intelligence", "DotNET", "Data Structures", "Algorithms", "Web Development", "Operating Systems" };

            // --- NAMES POOL ---
            var firstNames = new[] { "John", "Sarah", "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Niaj", "Olivia", "Peggy", "Rupert", "Sybil", "Trent", "Victor", "Walter", "Wendy", "Yvonne", "Zach", "Aaron", "Bella", "Caleb", "Diana", "Eli", "Fiona" };
            var lastNames = new[] { "Smith", "Johnson", "Brown", "Wilson", "Davis", "Miller", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill" };

            // --- USERS: ADMIN ---
            var adminUser = new User
            {
                Email = "admin@gyantrack.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin
            };
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            var admin = new Admin
            {
                AdminID = adminUser.Id,
                FullName = "System Administrator"
            };
            context.Admins.Add(admin);

            // --- USERS: EVALUATORS ---
            var evaluators = new List<Evaluator>();
            var evaluatorUsers = new List<User>();

            for (int i = 1; i <= 5; i++)
            {
                var fName = firstNames[random.Next(firstNames.Length)];
                var lName = lastNames[random.Next(lastNames.Length)];
                var eUser = new User
                {
                    Email = $"evaluator{i}@gyantrack.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("evaluator123"),
                    Role = UserRole.Evaluator
                };
                evaluatorUsers.Add(eUser);
                context.Users.Add(eUser);
            }
            await context.SaveChangesAsync();

            for (int i = 0; i < evaluatorUsers.Count; i++)
            {
                var fName = firstNames[random.Next(firstNames.Length)];
                var lName = lastNames[random.Next(lastNames.Length)];
                var evaluator = new Evaluator
                {
                    EvaluatorID = evaluatorUsers[i].Id,
                    FullName = $"{fName} {lName}",
                    Department = departments[random.Next(departments.Length)]
                };
                evaluators.Add(evaluator);
                context.Evaluators.Add(evaluator);
            }

            // --- USERS: INTERNS ---
            var interns = new List<Intern>();
            var internUsers = new List<User>();

            for (int i = 1; i <= 30; i++)
            {
                var iUser = new User
                {
                    Email = $"intern{i}@gyantrack.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("intern123"),
                    Role = UserRole.Intern
                };
                internUsers.Add(iUser);
                context.Users.Add(iUser);
            }
            await context.SaveChangesAsync();

            for (int i = 0; i < internUsers.Count; i++)
            {
                var fName = firstNames[random.Next(firstNames.Length)];
                var lName = lastNames[random.Next(lastNames.Length)];
                var intern = new Intern
                {
                    InternID = internUsers[i].Id,
                    FullName = $"{fName} {lName}",
                    Department = departments[random.Next(departments.Length)],
                    Batch = (2023 + random.Next(3)).ToString()
                };
                interns.Add(intern);
                context.Interns.Add(intern);
            }

            await context.SaveChangesAsync();

            // --- SUBJECTS ---
            var subjects = new List<Subject>();
            foreach (var sName in subjectNames)
            {
                var subject = new Subject { SubjectName = sName };
                subjects.Add(subject);
                context.Subjects.Add(subject);
            }
            await context.SaveChangesAsync();

            // --- ASSIGNMENT TEMPLATES ---
            var templates = new List<AssignmentTemplate>();
            foreach (var subject in subjects)
            {
                var ev = evaluators[random.Next(evaluators.Count)];
                
                var t1 = random.Next(50, 80);
                var c1 = random.Next(10, 30);
                var a1 = 100 - (t1 + c1);

                var template = new AssignmentTemplate
                {
                    SubjectID = subject.Id,
                    EvaluatorID = ev.EvaluatorID,
                    TechnicalWeight = t1,
                    CommunicationWeight = c1,
                    AttendanceWeight = a1,
                    CreatedBy = admin.AdminID
                };
                templates.Add(template);
            }
            context.AssignmentTemplates.AddRange(templates);
            await context.SaveChangesAsync();

            // --- EVALUATOR INTERN MAPPINGS ---
            var evaluatorInterns = new List<EvaluatorIntern>();
            foreach (var intern in interns)
            {
                var numEvaluators = random.Next(1, 3);
                var assignedEvaluators = evaluators.OrderBy(e => random.Next()).Take(numEvaluators).ToList();
                
                foreach (var ev in assignedEvaluators)
                {
                    evaluatorInterns.Add(new EvaluatorIntern
                    {
                        EvaluatorID = ev.EvaluatorID,
                        InternID = intern.InternID
                    });
                }
            }
            context.EvaluatorInterns.AddRange(evaluatorInterns);
            await context.SaveChangesAsync();

            // --- TESTS ---
            var tests = new List<Test>();
            var now = DateTime.UtcNow;
            foreach (var template in templates)
            {
                // Completed test
                tests.Add(new Test
                {
                    TemplateID = template.Id,
                    Title = $"{subjects.First(s => s.Id == template.SubjectID).SubjectName} Fundamentals - Past",
                    StartTime = now.AddDays(-random.Next(10, 30)),
                    EndTime = now.AddDays(-random.Next(2, 9)),
                    DurationMinutes = random.Next(30, 90),
                    CreatedBy = template.EvaluatorID
                });

                // Active test
                tests.Add(new Test
                {
                    TemplateID = template.Id,
                    Title = $"{subjects.First(s => s.Id == template.SubjectID).SubjectName} Advanced - Active",
                    StartTime = now.AddDays(-1),
                    EndTime = now.AddDays(7),
                    DurationMinutes = random.Next(45, 120),
                    CreatedBy = template.EvaluatorID
                });
            }
            context.Tests.AddRange(tests);
            await context.SaveChangesAsync();

            // --- QUESTIONS AND OPTIONS ---
            var questions = new List<Question>();
            var options = new List<Option>();

            foreach (var test in tests)
            {
                var numQuestions = random.Next(3, 8);
                for (int q = 1; q <= numQuestions; q++)
                {
                    var question = new Question
                    {
                        TestID = test.Id,
                        QuestionText = $"Sample Question {q} for {test.Title}?",
                        Marks = random.Next(5, 20)
                    };
                    questions.Add(question);
                    
                    var correctOptIndex = random.Next(0, 4);
                    for (int o = 0; o < 4; o++)
                    {
                        options.Add(new Option
                        {
                            Question = question, 
                            OptionText = $"Option {(char)('A' + o)} for Q{q}",
                            IsCorrect = (o == correctOptIndex)
                        });
                    }
                }
            }
            context.Questions.AddRange(questions);
            context.Options.AddRange(options);
            await context.SaveChangesAsync();

            // --- TEST ATTEMPTS AND ANSWERS ---
            var attempts = new List<TestAttempt>();
            var answers = new List<Answer>();

            foreach (var intern in interns)
            {
                var completedTests = tests.Where(t => t.EndTime < now).OrderBy(x => random.Next()).Take(random.Next(3, 8)).ToList();
                
                foreach (var test in completedTests)
                {
                    var attempt = new TestAttempt
                    {
                        TestID = test.Id,
                        InternID = intern.InternID,
                        StartTime = test.StartTime.AddMinutes(random.Next(1, 30)),
                        EndTime = test.EndTime.AddMinutes(-random.Next(1, 10)),
                        Score = 0, // Calculated below
                        IsSubmitted = true,
                        TabSwitchCount = random.Next(0, 3),
                        WindowFocusLossCount = random.Next(0, 2),
                        CopyPasteCount = random.Next(0, 5),
                        SystemScore = random.Next(50, 100),
                        IsVerified = random.NextDouble() > 0.2
                    };
                    attempts.Add(attempt);
                }
            }
            context.TestAttempts.AddRange(attempts);
            await context.SaveChangesAsync();

            foreach (var attempt in attempts)
            {
                var testQuestions = questions.Where(q => q.TestID == attempt.TestID).ToList();
                decimal totalScore = 0;
                
                foreach (var q in testQuestions)
                {
                    var qOptions = options.Where(o => o.QuestionID == q.Id).ToList();
                    if (qOptions.Any())
                    {
                        bool pickCorrect = random.NextDouble() < 0.7;
                        var selectedOption = pickCorrect 
                            ? qOptions.FirstOrDefault(o => o.IsCorrect) 
                            : qOptions.FirstOrDefault(o => !o.IsCorrect);
                            
                        if (selectedOption == null) selectedOption = qOptions.First();

                        var isCorrect = selectedOption.IsCorrect;
                        var marksAwarded = isCorrect ? q.Marks : 0;
                        totalScore += marksAwarded;

                        answers.Add(new Answer
                        {
                            AttemptID = attempt.Id,
                            QuestionID = q.Id,
                            SelectedOptionID = selectedOption.OptionID,
                            IsCorrect = isCorrect,
                            MarksAwarded = marksAwarded
                        });
                    }
                }
                
                attempt.Score = totalScore;
            }
            context.Answers.AddRange(answers);
            await context.SaveChangesAsync();

            // --- EVALUATOR REMARKS ---
            var remarks = new List<EvaluatorRemark>();
            foreach (var attempt in attempts.Where(a => a.IsVerified))
            {
                var assignedE = evaluatorInterns.Where(ei => ei.InternID == attempt.InternID).Select(ei => ei.EvaluatorID).ToList();
                var evsForIntern = evaluators.Where(e => assignedE.Contains(e.EvaluatorID)).ToList();
                if (!evsForIntern.Any()) evsForIntern = new List<Evaluator> { evaluators.First() };

                remarks.Add(new EvaluatorRemark
                {
                    AttemptID = attempt.Id,
                    EvaluatorID = evsForIntern[random.Next(evsForIntern.Count)].EvaluatorID,
                    Remarks = "The candidate demonstrated a solid understanding of the concepts but struggled slightly with time management. Code quality was good overall."
                });
            }
            context.EvaluatorRemarks.AddRange(remarks);
            await context.SaveChangesAsync();

            // --- PERFORMANCE SCORES ---
            var scores = new List<PerformanceScore>();
            foreach (var intern in interns)
            {
                var assignedE = evaluatorInterns.Where(ei => ei.InternID == intern.InternID).Select(ei => ei.EvaluatorID).ToList();
                var evsForIntern = evaluators.Where(e => assignedE.Contains(e.EvaluatorID)).ToList();
                if (!evsForIntern.Any()) evsForIntern = new List<Evaluator> { evaluators.First() };

                var randomTemplates = templates.OrderBy(t => random.Next()).Take(3).ToList();

                foreach (var template in randomTemplates)
                {
                    scores.Add(new PerformanceScore
                    {
                        InternID = intern.InternID,
                        TemplateID = template.Id,
                        TechnicalScore = random.Next(40, 100),
                        CommunicationScore = random.Next(40, 100),
                        AttendanceScore = random.Next(60, 100),
                        EvaluatorID = evsForIntern[random.Next(evsForIntern.Count)].EvaluatorID
                    });
                }
            }
            context.PerformanceScores.AddRange(scores);
            await context.SaveChangesAsync();
        }
    }
}
