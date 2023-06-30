import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Typography,
} from "@mui/material";

interface Student {
  firstName: string;
  lastName: string;
  standard: string;
  gender: string;
  email: string;
  mobileNumber: string;
  profileImage: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  standard: Yup.string().required("Standard is required"),
  gender: Yup.string().required("Gender is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobileNumber: Yup.string().required("Mobile Number is required"),
  profilePicture: Yup.string(),
});

const StudentUpdate = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (values: Student) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `http://localhost:8080/student/update/${studentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            profileImage: values.profileImage.split(",")[1], // Extract the base64 image data),
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (data.status) {
          const confirmed = window.confirm(
            "Student updated successfully. Do you want to go back to the student list?"
          );
          if (confirmed) {
            navigate("/");
          }
        } else {
          throw new Error(data.message);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = reader.result as string;
        formik.setFieldValue("profileImage", base64Image);
      };

      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      standard: "",
      gender: "male",
      email: "",
      mobileNumber: "",
      profileImage: "", 
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          `http://localhost:8080/student/${studentId}`,
          {
            method: "GET",
            headers: {
              Authorization: token!,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          formik.setValues(data.data); // Set the formik values using fetched data
        } else {
          console.error("Error fetching student:", data.message);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Check if data is still loading
  if (loading) {
    return <h4 style={{ textAlign: "center" }}>Loading...</h4>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom margin={5}>
        Student Update Form
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              fullWidth
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              fullWidth
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Standard"
              variant="outlined"
              name="standard"
              value={formik.values.standard}
              onChange={formik.handleChange}
              fullWidth
              error={formik.touched.standard && Boolean(formik.errors.standard)}
              helperText={formik.touched.standard && formik.errors.standard}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={formik.values.gender}
                onChange={(event) =>
                  formik.setFieldValue("gender", event.target.value)
                }
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <Typography color="error">{formik.errors.gender}</Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              fullWidth
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mobile Number"
              variant="outlined"
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              fullWidth
              error={
                formik.touched.mobileNumber &&
                Boolean(formik.errors.mobileNumber)
              }
              helperText={
                formik.touched.mobileNumber && formik.errors.mobileNumber
              }
            />
          </Grid>
          <Grid item xs={12} mt={3}>
            <input
              type="file"
              accept="image/*"
              id="profileImage"
              name="profileImage"
              onChange={handleFileChange}
            />
          </Grid>
          <Grid item xs={12}>
            {formik.values.profileImage && (
              <img
                src={formik.values.profileImage}
                alt="Profile Image"
                style={{
                  width: "100px",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default StudentUpdate;