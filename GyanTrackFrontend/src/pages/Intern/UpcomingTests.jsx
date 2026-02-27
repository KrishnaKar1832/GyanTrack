import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import DashboardLayout from "../../components/layout/DashboardLayout";

const UpcomingTests = () => {
  const tests = [
    { id: 1, subject: "React", date: "20 Feb 2026" },
    { id: 2, subject: ".NET", date: "25 Feb 2026" },
  ];

  return (
    <DashboardLayout>
      <Paper elevation={4}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.subject}</TableCell>
                <TableCell>{t.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </DashboardLayout>
  );
};

export default UpcomingTests;