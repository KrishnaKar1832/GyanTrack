using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GyanTrack.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    AdminID = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.AdminID);
                    table.ForeignKey(
                        name: "FK_Admins_Users_AdminID",
                        column: x => x.AdminID,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Evaluators",
                columns: table => new
                {
                    EvaluatorID = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evaluators", x => x.EvaluatorID);
                    table.ForeignKey(
                        name: "FK_Evaluators_Users_EvaluatorID",
                        column: x => x.EvaluatorID,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Interns",
                columns: table => new
                {
                    InternID = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Batch = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interns", x => x.InternID);
                    table.ForeignKey(
                        name: "FK_Interns_Users_InternID",
                        column: x => x.InternID,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssignmentTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectID = table.Column<int>(type: "int", nullable: false),
                    EvaluatorID = table.Column<int>(type: "int", nullable: false),
                    TechnicalWeight = table.Column<int>(type: "int", nullable: false),
                    CommunicationWeight = table.Column<int>(type: "int", nullable: false),
                    AttendanceWeight = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssignmentTemplates", x => x.Id);
                    table.CheckConstraint("CK_Weightage_Sum", "TechnicalWeight + CommunicationWeight + AttendanceWeight = 100");
                    table.ForeignKey(
                        name: "FK_AssignmentTemplates_Admins_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AssignmentTemplates_Evaluators_EvaluatorID",
                        column: x => x.EvaluatorID,
                        principalTable: "Evaluators",
                        principalColumn: "EvaluatorID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AssignmentTemplates_Subjects_SubjectID",
                        column: x => x.SubjectID,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EvaluatorInterns",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EvaluatorID = table.Column<int>(type: "int", nullable: false),
                    InternID = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatorInterns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatorInterns_Evaluators_EvaluatorID",
                        column: x => x.EvaluatorID,
                        principalTable: "Evaluators",
                        principalColumn: "EvaluatorID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EvaluatorInterns_Interns_InternID",
                        column: x => x.InternID,
                        principalTable: "Interns",
                        principalColumn: "InternID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PerformanceScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InternID = table.Column<int>(type: "int", nullable: false),
                    TemplateID = table.Column<int>(type: "int", nullable: false),
                    TechnicalScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CommunicationScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AttendanceScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EvaluatorID = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformanceScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PerformanceScores_AssignmentTemplates_TemplateID",
                        column: x => x.TemplateID,
                        principalTable: "AssignmentTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceScores_Evaluators_EvaluatorID",
                        column: x => x.EvaluatorID,
                        principalTable: "Evaluators",
                        principalColumn: "EvaluatorID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceScores_Interns_InternID",
                        column: x => x.InternID,
                        principalTable: "Interns",
                        principalColumn: "InternID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TemplateID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tests_AssignmentTemplates_TemplateID",
                        column: x => x.TemplateID,
                        principalTable: "AssignmentTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tests_Evaluators_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Evaluators",
                        principalColumn: "EvaluatorID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TestID = table.Column<int>(type: "int", nullable: false),
                    QuestionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marks = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Tests_TestID",
                        column: x => x.TestID,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestAttempts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TestID = table.Column<int>(type: "int", nullable: false),
                    InternID = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Score = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsSubmitted = table.Column<bool>(type: "bit", nullable: false),
                    TabSwitchCount = table.Column<int>(type: "int", nullable: false),
                    WindowFocusLossCount = table.Column<int>(type: "int", nullable: false),
                    CopyPasteCount = table.Column<int>(type: "int", nullable: false),
                    SystemScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestAttempts_Interns_InternID",
                        column: x => x.InternID,
                        principalTable: "Interns",
                        principalColumn: "InternID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestAttempts_Tests_TestID",
                        column: x => x.TestID,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Options",
                columns: table => new
                {
                    OptionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionID = table.Column<int>(type: "int", nullable: false),
                    OptionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Options", x => x.OptionID);
                    table.ForeignKey(
                        name: "FK_Options_Questions_QuestionID",
                        column: x => x.QuestionID,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EvaluatorRemarks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AttemptID = table.Column<int>(type: "int", nullable: false),
                    EvaluatorID = table.Column<int>(type: "int", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatorRemarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatorRemarks_Evaluators_EvaluatorID",
                        column: x => x.EvaluatorID,
                        principalTable: "Evaluators",
                        principalColumn: "EvaluatorID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EvaluatorRemarks_TestAttempts_AttemptID",
                        column: x => x.AttemptID,
                        principalTable: "TestAttempts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AttemptID = table.Column<int>(type: "int", nullable: false),
                    QuestionID = table.Column<int>(type: "int", nullable: false),
                    SelectedOptionID = table.Column<int>(type: "int", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    MarksAwarded = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Answers_Options_SelectedOptionID",
                        column: x => x.SelectedOptionID,
                        principalTable: "Options",
                        principalColumn: "OptionID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Answers_Questions_QuestionID",
                        column: x => x.QuestionID,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Answers_TestAttempts_AttemptID",
                        column: x => x.AttemptID,
                        principalTable: "TestAttempts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answers_AttemptID",
                table: "Answers",
                column: "AttemptID");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_QuestionID",
                table: "Answers",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_SelectedOptionID",
                table: "Answers",
                column: "SelectedOptionID");

            migrationBuilder.CreateIndex(
                name: "IX_AssignmentTemplates_CreatedBy",
                table: "AssignmentTemplates",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_AssignmentTemplates_EvaluatorID",
                table: "AssignmentTemplates",
                column: "EvaluatorID");

            migrationBuilder.CreateIndex(
                name: "IX_AssignmentTemplates_SubjectID",
                table: "AssignmentTemplates",
                column: "SubjectID");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatorInterns_EvaluatorID_InternID",
                table: "EvaluatorInterns",
                columns: new[] { "EvaluatorID", "InternID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatorInterns_InternID",
                table: "EvaluatorInterns",
                column: "InternID");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatorRemarks_AttemptID",
                table: "EvaluatorRemarks",
                column: "AttemptID");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatorRemarks_EvaluatorID",
                table: "EvaluatorRemarks",
                column: "EvaluatorID");

            migrationBuilder.CreateIndex(
                name: "IX_Options_QuestionID",
                table: "Options",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceScores_EvaluatorID",
                table: "PerformanceScores",
                column: "EvaluatorID");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceScores_InternID",
                table: "PerformanceScores",
                column: "InternID");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceScores_TemplateID",
                table: "PerformanceScores",
                column: "TemplateID");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_TestID",
                table: "Questions",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_SubjectName",
                table: "Subjects",
                column: "SubjectName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestAttempts_InternID",
                table: "TestAttempts",
                column: "InternID");

            migrationBuilder.CreateIndex(
                name: "IX_TestAttempts_TestID",
                table: "TestAttempts",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_CreatedBy",
                table: "Tests",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_TemplateID",
                table: "Tests",
                column: "TemplateID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Answers");

            migrationBuilder.DropTable(
                name: "EvaluatorInterns");

            migrationBuilder.DropTable(
                name: "EvaluatorRemarks");

            migrationBuilder.DropTable(
                name: "PerformanceScores");

            migrationBuilder.DropTable(
                name: "Options");

            migrationBuilder.DropTable(
                name: "TestAttempts");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "Interns");

            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.DropTable(
                name: "AssignmentTemplates");

            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "Evaluators");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
