using Microsoft.Data.SqlClient;

var connStr = "Server=IN-G60JR24;Database=GyanTrackDB;User Id=sa;Password=sa;TrustServerCertificate=True";

// 1. Fix password hashes for all known seed users
var users = new[]
{
    ("admin@gyantrack.com",      "admin123"),
    ("evaluator@gyantrack.com",  "evaluator123"),
    ("evaluator2@gyantrack.com", "evaluator123"),
    ("intern@gyantrack.com",     "intern123"),
    ("intern2@gyantrack.com",    "intern123"),
    ("intern3@gyantrack.com",    "intern123"),
};

using var conn = new SqlConnection(connStr);
conn.Open();

Console.WriteLine("=== Fixing Password Hashes ===");
foreach (var (email, password) in users)
{
    var hash = BCrypt.Net.BCrypt.HashPassword(password);
    using var cmd = new SqlCommand("UPDATE Users SET PasswordHash = @hash WHERE Email = @email", conn);
    cmd.Parameters.AddWithValue("@hash", hash);
    cmd.Parameters.AddWithValue("@email", email);
    int rows = cmd.ExecuteNonQuery();
    Console.WriteLine($"  [{(rows > 0 ? "✓" : "✗")}] {email}");
}

// 2. Add more subjects if they don't exist
Console.WriteLine("\n=== Ensuring Subjects Exist ===");
var subjectNames = new[] { "Java", "Python", "DBMS", "Cloud Computing", "AI & ML", ".NET Core", "React JS", "DevOps" };
foreach (var subj in subjectNames)
{
    using var checkCmd = new SqlCommand("SELECT COUNT(*) FROM Subjects WHERE SubjectName = @name", conn);
    checkCmd.Parameters.AddWithValue("@name", subj);
    int exists = (int)checkCmd.ExecuteScalar()!;
    if (exists == 0)
    {
        using var insertCmd = new SqlCommand("INSERT INTO Subjects (SubjectName, IsDeleted, CreatedAt) VALUES (@name, 0, GETUTCDATE())", conn);
        insertCmd.Parameters.AddWithValue("@name", subj);
        insertCmd.ExecuteNonQuery();
        Console.WriteLine($"  [+] Added subject: {subj}");
    }
    else
    {
        Console.WriteLine($"  [=] Subject exists: {subj}");
    }
}

// 3. Verify user counts
Console.WriteLine("\n=== User Counts ===");
foreach (var table in new[] { "Users", "Admins", "Evaluators", "Interns", "Subjects", "AssignmentTemplates", "PerformanceScores" })
{
    using var cntCmd = new SqlCommand($"SELECT COUNT(*) FROM {table}", conn);
    var count = (int)cntCmd.ExecuteScalar()!;
    Console.WriteLine($"  {table}: {count} rows");
}

Console.WriteLine("\n✅ Done! Restart backend and try logging in.");
