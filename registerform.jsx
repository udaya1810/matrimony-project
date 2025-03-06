import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    religion: "",
    caste: "",
  });

  const [errors, setErrors] = useState({
    religion: "",
    caste: "",
  });

  const [religions, setReligions] = useState([]);
  const [castes, setCastes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/religions")
      .then((response) => {
        setReligions(response.data);
      })
      .catch((error) => console.error("Error fetching religions:", error));
  }, []);

  const handleReligionChange = (e) => {
    const selectedReligion = e.target.value;
    setFormData((prev) => ({ ...prev, religion: selectedReligion, caste: "" }));
    setCastes([]);
    setLoading(true);

    axios
      .get(`http://localhost:5000/castes/${selectedReligion}`)
      .then((response) => {
        setCastes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching castes:", error);
        setLoading(false);
      });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.religion) {
      formErrors.religion = "Religion is required";
      isValid = false;
    }
    if (!formData.caste.trim()) {
      formErrors.caste = "Caste is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/register",
          formData
        );
        console.log("Data inserted successfully:", response.data);
        alert("Registration successful! 🎉");
        setFormData({ religion: "", caste: "" });
      } catch (error) {
        console.error("Error inserting data:", error);
        alert("Error registering. Please try again.");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
    
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#6a1b9a",
          textTransform: "uppercase",
          marginBottom: "2rem",
          letterSpacing: "1px",
          "&:hover": {
            color: "#8e24aa",
          },
        }}
      >
        Register & Find Your Match
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: { xs: "2rem", sm: "3rem", md: "4rem" },
        }}
      >
    
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#6a1b9a",
                fontWeight: "bold",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                textAlign: "center",
                "&:hover": {
                  color: "#ab47bc",
                },
              }}
            >
              Register Account
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <FormControl fullWidth error={!!errors.religion}>
                  <InputLabel sx={{ color: "#6a1b9a" }}>Religion</InputLabel>
                  <Select name="religion" value={formData.religion} onChange={handleReligionChange}>
                    {religions.map((religion, index) => (
                      <MenuItem key={index} value={religion.religion}>
                        {religion.religion}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.religion && <FormHelperText>{errors.religion}</FormHelperText>}
                </FormControl>

                <Autocomplete
                  freeSolo
                  options={[formData.caste, ...castes.map((caste) => caste.caste)]}
                  value={formData.caste}
                  onChange={(event, newValue) => {
                    setFormData((prev) => ({ ...prev, caste: newValue || "" }));
                  }}
                  inputValue={formData.caste}
                  onInputChange={(event, newInputValue) => {
                    setFormData((prev) => ({ ...prev, caste: newInputValue }));
                  }}
                  filterOptions={(options, { inputValue }) => {
                    const filtered = options.filter((option) =>
                      option.toLowerCase().includes(inputValue.toLowerCase())
                    );
                    return [inputValue, ...filtered.filter((opt) => opt !== inputValue)];
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Caste" variant="outlined" error={!!errors.caste} helperText={errors.caste} />
                  )}
                  disabled={!formData.religion || loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    background: "linear-gradient(135deg, #6a1b9a, #8e24aa)",
                    color: "#fff",
                    borderRadius: "15px",
                    padding: "12px",
                    fontWeight: "bold",
                    "&:hover": {
                      background: "linear-gradient(135deg, #8e24aa, #c2185b)",
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src="./th.jpg"
            alt="Registration"
            style={{
              width: "100%",
              maxHeight: "400px",
              borderRadius: "20px",
              objectFit: "cover",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;
