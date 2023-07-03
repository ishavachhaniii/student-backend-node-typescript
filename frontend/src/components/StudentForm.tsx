  import React from "react";
  import { Formik, Form, Field, ErrorMessage } from "formik";
  import {
    TextField,
    Button,
    Grid,
    Container,
    Typography,
    RadioGroup,
    FormControl,
    FormControlLabel,
    Radio,
    FormLabel,
  } from "@mui/material";
  import * as Yup from "yup";
  import { useNavigate } from "react-router-dom";

  interface FormData {
    firstName: string;
    lastName: string;
    standard: string;
    divison: string;
    gender: string;
    email: string;
    mobileNumber: string;
    address: string;
    profileImage: string;
  }

  const StudentForm = () => {
    const initialValues: FormData = {
      firstName: "",
      lastName: "",
      standard: "",
      divison: "",
      gender: "",
      email: "",
      mobileNumber: "",
      address: "",
      profileImage: "",
    };

    const validationSchema = Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      standard: Yup.string().required("Standard is required"),
      divison: Yup.string().required("Divison is required"),
      gender: Yup.string().required("Gender is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNumber: Yup.string().required("Mobile Number is required"),
      address: Yup.string().required("Address is required"),
      profileImage: Yup.string(),
    });

    const navigate = useNavigate();

    const handleSubmit = (values: FormData) => {
      // Encode the profile image as base64 and assign it to profileImage field
      const fileInput = document.getElementById(
        "profileImage"
      ) as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result?.toString()?.split(",")[1];
          values.profileImage = base64Image || ""; // Assign the base64 data to the profileImage field
          sendFormValues(values); // Call the function to handle form submission
        };
        reader.readAsDataURL(file);
      } else {
        sendFormValues(values); // Call the function to handle form submission
      }
    };

    const sendFormValues = (values: FormData) => {
      const token = localStorage.getItem("Token");

      // Make a POST request to the sign-up endpoint
      fetch("http://localhost:8080/student/add", {
        method: "POST",
        headers: {
          Authorization: token!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            // Store the token in local storage
            localStorage.setItem("Token", data.token);
            // Redirect to the home page or dashboard
            navigate("/");
          } else {
            // Handle sign-up error
            console.log(data.message);
          }
        })
        .catch((error) => {
          console.log("Error signing up:", error);
        });
    };

    return (
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom margin={5}>
          Student Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                  />  
                  <ErrorMessage name="firstName" component="div" />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    variant="outlined"  
                    fullWidth
                  />
                  <ErrorMessage name="lastName" component="div" />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
                    id="standard"
                    name="standard"
                    label="Standard"
                    variant="outlined"
                    fullWidth
                  />
                  <ErrorMessage name="standard" component="div" />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
                    id="divison"
                    name="divison"
                    label="Divison"
                    variant="outlined"
                    fullWidth
                  />
                  <ErrorMessage name="divison" component="div" />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <Field name="gender">
                      {({ field }: { field: any }) => (
                        <RadioGroup
                          {...field}
                          style={{ display: "flex", flexDirection: "row" }}
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
                          <FormControlLabel
                            value="other"
                            control={<Radio />}
                            label="Other"
                          />
                        </RadioGroup>
                      )}
                    </Field>
                    <ErrorMessage name="gender" component="div" />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                  <ErrorMessage name="email" component="div" />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                  />
                  <ErrorMessage name="mobileNumber" component="div" />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
                    id="address"
                    name="address"
                    label="Address"
                    variant="outlined"
                    fullWidth
                  />
                  <ErrorMessage name="address" component="div" />
                </Grid>
              </Grid>
              <Grid item xs={12} mt={3}>
                <input
                  type="file"
                  accept="image/*"
                  id="profileImage"
                  name="profileImage"
                />
              </Grid>
              <Grid item xs={12} mt={3}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Form>
        </Formik>
      </Container>
    );
  };

  export default StudentForm;
