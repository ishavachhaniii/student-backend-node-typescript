import { Container, Paper, Typography, Grid, Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  standard: string;
  gender: string;
  email: string;
  mobileNumber: string;
}

const ViewStudent = () => {
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const { studentId } = useParams();
  const navigate = useNavigate();

  const fetchStudentDetails = () => {
    const token = localStorage.getItem("Token");

    fetch(`http://localhost:8080/student/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          setStudentDetails(data.data);
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log("Error fetching student details:", error);
      });
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const handleBackButtonClick = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {studentDetails ? (
        <div>
          <Typography variant="h4" align="center" gutterBottom margin={8}>
            Student Detail
          </Typography>
          <Container>
            <Paper elevation={3} sx={{ padding: "50px", maxWidth: "700px" }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <img
                    src={`data:image/png;base64,${studentDetails.profileImage}`}
                    alt="Profile Image"
                    style={{ width: 200, marginLeft: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle1">
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        Student ID :{" "}
                      </Typography>
                      {studentDetails._id}
                    </Typography>

                    <Typography variant="subtitle1">
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        First Name :{" "}
                      </Typography>
                      {studentDetails.firstName}
                    </Typography>

                    <Typography variant="subtitle1">
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        Last Name :{" "}
                      </Typography>
                      {studentDetails.lastName}
                    </Typography>

                    <Typography variant="subtitle1">
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        Email :{" "}
                      </Typography>
                      {studentDetails.email}
                    </Typography>

                    <Typography variant="subtitle1">
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        Standard :{" "}
                      </Typography>
                      {studentDetails.standard}
                    </Typography>

                    <Typography variant="subtitle1">
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        Gender :{" "}
                      </Typography>
                      {studentDetails.gender}
                    </Typography>

                    <Typography variant="subtitle1">
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        Mobile Number :{" "}
                      </Typography>
                      {studentDetails.mobileNumber}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box mt={7} textAlign={"center"}>
                <Button variant="contained" onClick={handleBackButtonClick}>
                  Back to Student List
                </Button>
              </Box>
            </Paper>
          </Container>
        </div>
      ) : (
        <Typography variant="h4" align="center" gutterBottom margin={5}>
          Loading...
        </Typography>
      )}
    </div>
  );
};

export default ViewStudent;


