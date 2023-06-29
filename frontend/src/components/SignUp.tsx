import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(5, "First name should be at least 5 characters long"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(5, "Last name should be at least 5 characters long"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters long"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
    mobileNumber: Yup.string()
      .required("Contact No is required")
      .matches(/^[0-9]{10}$/, {
        message: "Please enter a valid 10-digit phone number",
        excludeEmptyString: false,
      }),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileNumber: string;
  }) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        mobileNumber,
      } = values;

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("mobileNumber", mobileNumber);

      const response = await fetch("http://localhost:8080/school/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log(data);

      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem("Token", data.token);
        // Navigate to the signin page
        navigate("/school/signin");
      } else {
        const confirmed = window.confirm("Are you sure you want to sign up?");
        if (!confirmed) {
          return;
        }
      }
    } catch (error) {
      console.log(error);
      // Handle error during signup, e.g., display error message
    }
  };
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom margin={5}>
        Sign Up Form
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
                type="text"
                name="firstName"
                as={TextField}
                label="First Name"
                fullWidth
                required
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="error"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="text"
                name="lastName"
                as={TextField}
                label="Last Name"
                fullWidth
                required
              />
              <ErrorMessage name="lastName" component="div" className="error" />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="email"
                name="email"
                as={TextField}
                label="Email"
                fullWidth
                required
              />
              <ErrorMessage name="email" component="div" className="error" />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="password"
                name="password"
                as={TextField}
                label="Password"
                fullWidth
                required
              />
              <ErrorMessage name="password" component="div" className="error" />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="password"
                name="confirmPassword"
                as={TextField}
                label="Confirm Password"
                fullWidth
                required
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="text"
                name="mobileNumber"
                as={TextField}
                label="Mobile Number"
                fullWidth
                required
              />
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="error"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
};
export default Signup;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { TextField, Button, Container, Grid, Typography } from "@mui/material";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const SignUp = () => {
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     firstName: Yup.string()
//       .min(5, "First name must be at least 5 characters long")
//       .required("First Name is required"),
//     lastName: Yup.string()
//       .min(5, "Last name must be at least 5 characters long")
//       .required("Last Name is required"),
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//     password: Yup.string()
//       .min(5, "Password must be at least 5 characters long")
//       .required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password"), ""], "Passwords must match")
//       .required("Confirm Password is required"),
//     mobileNumber: Yup.string()
//       .length(10, "Mobile number must have exactly 10 digits")
//       .required("Mobile Number is required"),
//     // profileImage: Yup.mixed().required("Profile Image is required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       mobileNumber: "",
//     //   profileImage: null,
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       // Prepare form data for the request
//       const formData = new FormData();
//     //   Object.entries(values).forEach(([key, value]) => {
//     //     if (key === "profileImage" && value) {
//     //       formData.append(key, value);
//     //     } else {
//     //       formData.append(key, String(value));
//     //     }
//     //   });

//       // Make a POST request to the sign-up endpoint
//       fetch("http://localhost:8080/school/signup", {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.status) {
//             // Store the token in local storage
//             localStorage.setItem("token", data.token);
//             // Redirect to the home page or dashboard
//             navigate("/school/signin");
//           } else {
//             // Handle sign-up error
//             console.log(data.message);
//           }
//         })
//         .catch((error) => {
//           console.log("Error signing up:", error);
//         });
//     },
//   });
//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" align="center" gutterBottom marginTop={5}>
//         Sign Up Form
//       </Typography>
//       <Grid container spacing={2} marginTop={5}>
//         <Grid item xs={12}>
//           <form onSubmit={formik.handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   type="text"
//                   label="First Name"
//                   name="firstName"
//                   value={formik.values.firstName}
//                   onChange={formik.handleChange}
//                   error={
//                     !!formik.touched.firstName && !!formik.errors.firstName
//                   }
//                   helperText={
//                     formik.touched.firstName && formik.errors.firstName
//                   }
//                   required
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   type="text"
//                   label="Last Name"
//                   name="lastName"
//                   value={formik.values.lastName}
//                   onChange={formik.handleChange}
//                   error={!!formik.touched.lastName && !!formik.errors.lastName}
//                   helperText={formik.touched.lastName && formik.errors.lastName}
//                   required
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   type="email"
//                   label="Email"
//                   name="email"
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   error={!!formik.touched.email && !!formik.errors.email}
//                   helperText={formik.touched.email && formik.errors.email}
//                   required
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   type="password"
//                   label="Password"
//                   name="password"
//                   value={formik.values.password}
//                   onChange={formik.handleChange}
//                   error={!!formik.touched.password && !!formik.errors.password}
//                   helperText={formik.touched.password && formik.errors.password}
//                   required
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   type="password"
//                   label="Confirm Password"
//                   name="confirmPassword"
//                   value={formik.values.confirmPassword}
//                   onChange={formik.handleChange}
//                   error={
//                     !!formik.touched.confirmPassword &&
//                     !!formik.errors.confirmPassword
//                   }
//                   helperText={
//                     formik.touched.confirmPassword &&
//                     formik.errors.confirmPassword
//                   }
//                   required
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   type="text"
//                   label="Mobile Number"
//                   name="mobileNumber"
//                   value={formik.values.mobileNumber}
//                   onChange={formik.handleChange}
//                   error={
//                     !!formik.touched.mobileNumber &&
//                     !!formik.errors.mobileNumber
//                   }
//                   helperText={
//                     formik.touched.mobileNumber && formik.errors.mobileNumber
//                   }
//                   required
//                   fullWidth
//                 />
//               </Grid>
//               {/* <Grid item xs={12}>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(event) => {
//                     const file = event.target.files?.[0];
//                     formik.setFieldValue("profileImage", file);
//                   }}
//                 />
//                 {formik.touched.profileImage && formik.errors.profileImage && (
//                   <div>{formik.errors.profileImage}</div>
//                 )}
//               </Grid> */}
//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                 >
//                   Sign Up
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default SignUp;
