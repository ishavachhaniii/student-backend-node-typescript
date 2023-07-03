import React, { useState, useEffect, MouseEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  standard: String;
  divison: String;
  gender: String;
  email: string;
  mobileNumber: string;
  address : string;
}

const StudentList = () => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  // const [filteredStudentList, setFilteredStudentList] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const navigate = useNavigate();

  const fetchStudentList = () => {
    const token = localStorage.getItem("Token");

    fetch(
      `http://localhost:8080/student/all?page=${currentPage}&limit=${pageSize}&search=${searchQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setStudentList(data.data.students);
          // setFilteredStudentList(data.data.students);
          setTotalPages(data.data.totalPages); // Update the total number of pages
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log("Error fetching student list:", error);
      });
  };

  useEffect(() => {
    fetchStudentList();
  }, [currentPage, pageSize, searchQuery]);

  const handleDeleteStudent = (studentId: string) => {
    const token = localStorage.getItem("Token");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) {
      return;
    }

    fetch(`http://localhost:8080/student/delete/${studentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setStudentList((prevStudentList) =>
            prevStudentList.filter((student) => student._id !== studentId)
          );
          console.log("Student deleted successfully");
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log("Error deleting student:", error);
      });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredStudents = studentList.filter(
      (student) =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );

    setStudentList(filteredStudents);
  };

  const handlePageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    setCurrentPage(page + 1); // Update the current page correctly
  };

  const handleUpdateStudent = (studentId: string) => {
    navigate(`/student/update/${studentId}`);
  };

  const handleViewStudent = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom margin={5}>
        Student List
      </Typography>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        marginBottom={2}
        item
        gap={5}
      >
        <Grid item xs={6} sx={{ width: "400px" }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth={true}
            value={searchQuery}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/student")}
          >
            Add Student
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{padding: 60}}>
        <Table>
          <TableHead>
            <TableRow >
            <TableCell style={{fontWeight: "bold"}}>Sr No.</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Profile Image</TableCell>
              <TableCell style={{fontWeight: "bold"}}>First Name</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Last Name</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Standard</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Divison</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Gender</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Email</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Mobile Number</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Address</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" style={{fontWeight: "bold", fontSize: "20px"}}>
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              studentList.map((student, index) => (
                <TableRow key={student._id}>
                <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {student.profileImage && (
                      <img
                        src={`data:image/png;base64,${student.profileImage}`}
                        alt="Profile"
                        style={{ width: "70px", height: "70px" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.standard}</TableCell>
                  <TableCell>{student.divison}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobileNumber}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>
                  <Button
                      onClick={() => handleUpdateStudent(student._id)}
                      color="primary"
                      variant="contained"
                      style={{ marginRight: 10 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteStudent(student._id)}
                      color="error"
                      variant="contained"
                      style={{ marginRight: 10 }}
                    >
                      Delete
                    </Button>
                    
                    <Button
                      onClick={() => handleViewStudent(student._id)}
                      color="info"
                      variant="contained"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[3, 5, 7, 10]}
          component="div"
          count={totalPages * pageSize}
          rowsPerPage={pageSize}
          page={currentPage - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={(event) =>
            setPageSize(parseInt(event.target.value, 10))
          }
        />
      </TableContainer>
    </div>
  );
};

export default StudentList;