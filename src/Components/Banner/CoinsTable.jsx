import React, { useEffect, useState } from "react";
import { CoinList } from "../../config/api";
import axios from "axios";
import { CryptoState } from "../../CryptoContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Container,
  createTheme,
  ThemeProvider,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
} from "@mui/material";

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // Track the current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set how many rows to display per page

  // Access the currency from the context
  const { currency } = CryptoState();
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchCoins = async () => {
    setLoading(true);
    try {
      // Fetch coins data from the API
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch coins when currency changes
  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  // Function to format market cap with commas and add units (M, B, etc.)
  const numberWithCommas = (x) => {
    let formattedValue = x.toString();

    // If the value is greater than a billion
    if (x >= 1e9) {
      formattedValue = (x / 1e9).toFixed(1) + "B"; // Divide by 1 billion and append 'B'
    }
    // If the value is greater than a million
    else if (x >= 1e6) {
      formattedValue = (x / 1e6).toFixed(1) + "M"; // Divide by 1 million and append 'M'
    }
    // For values less than a million, format with commas
    else {
      formattedValue = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return formattedValue;
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat", color: "white" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>

        {/* Search Bar */}
        <TextField
          onChange={(e) => setSearch(e.target.value)}
          label="Search For a Crypto Currency.."
          variant="outlined"
          style={{
            marginBottom: 20,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.15)", // Transparent white background
            borderRadius: "5px", // rounded corners
            color: "white", // White text color
            borderColor: "white", // White border color
          }}
        ></TextField>

        {loading ? (
          <LinearProgress color="primary" />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead style={{ backgroundColor: "yellow" }}>
                  <TableRow>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Coin
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Price
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      24h Change
                    </TableCell>
                    <TableCell style={{ color: "black", fontWeight: "bold" }}>
                      Market Cap
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {coins
                    .filter((coin) =>
                      coin.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Pagination logic
                    .map((coin) => {
                      const profit = coin.price_change_percentage_24h >= 0;

                      return (
                        <TableRow
                          key={coin.id}
                          onClick={() => navigate(`/coins/${coin.id}`)} // Navigate to CoinPage on click
                          sx={{
                            "&:hover": {
                              backgroundColor: "#131111", // Change the background color on hover
                              cursor: "pointer", // Change cursor to pointer
                            },
                          }}
                        >
                          <TableCell
                            style={{
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={coin.image}
                              alt={coin.name}
                              style={{
                                width: "50px", // Larger image size
                                height: "50px", // Larger image size
                                marginRight: "10px",
                              }}
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                style={{ fontSize: "16px", fontWeight: "bold" }}
                              >
                                {coin.name}
                              </span>
                              <span style={{ fontSize: "12px", color: "gray" }}>
                                {coin.symbol.toUpperCase()}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell style={{ color: "white" }}>
                            {currency} {coin.current_price.toFixed(2)}
                          </TableCell>

                          <TableCell
                            style={{
                              color: profit ? "green" : "red",
                            }}
                          >
                            {profit && "+"}
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>

                          <TableCell style={{ color: "white" }}>
                            {currency} {numberWithCommas(coin.market_cap)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Table Pagination with Custom Styling */}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={coins.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{
                backgroundColor: "#333", // Dark background for pagination
                color: "white", // White text color
                borderTop: "1px solid #555", // Dark border for separation
              }}
              // Customize the Text and Buttons within the Pagination
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count}`
              }
            />
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
