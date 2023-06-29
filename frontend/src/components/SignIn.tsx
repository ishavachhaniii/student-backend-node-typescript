import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import * as Yup from "yup";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const initialValues: SignInFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values: SignInFormValues) => {
    fetch("http://localhost:8080/school/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          localStorage.setItem("Token", data.token);
          navigate("/"); // Redirect to the user list page
        } else {
          console.log(data.message); // Handle sign-in error
        }
      })
      .catch((error) => {
        console.log("Error signing in:", error);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom marginTop={5}>
        Sign In Form
      </Typography>
      <Grid container spacing={2} marginTop={5}>
        <Grid item xs={12}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="Password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={formik.isSubmitting}
                >
                  Sign In
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignIn;