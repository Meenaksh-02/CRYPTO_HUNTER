import React from "react";
import {
  AppBar,
  Container,
  createTheme,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { styled } from "@mui/system";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

// Create a styled version of the Select component
const CustomSelect = styled(Select)(({ theme }) => ({
  width: 100,
  height: 40,
  marginRight: 15,
  color: "white", // Text color
  "& .MuiOutlinedInput-root": {
    color: "white", // Input text color
    "& fieldset": {
      borderColor: "white", // Border color
    },
    "&:hover fieldset": {
      borderColor: "white", // Border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "white", // Border color on focus
    },
  },
  "& .MuiSelect-icon": {
    color: "white", // Color of the dropdown icon
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { currency, setCurrency } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value); // Update the state with the selected value
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate("/")}
              className={classes.title}
              variant="h6"
            >
              Crypto Hunter
            </Typography>

            <CustomSelect
              value={currency}
              variant="outlined"
              onChange={handleCurrencyChange}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
            </CustomSelect>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
