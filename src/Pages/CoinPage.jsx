import React, { useEffect, useState } from "react";
import { LinearProgress, Typography, Box } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../utils/formatUtils";
import { CryptoState } from "../CryptoContext";
import { styled } from "@mui/system";

// Define the styled components
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: "30%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 25,
  borderRight: "2px solid grey",
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: 20,
  fontFamily: "Montserrat",
}));

const Description = styled(Typography)(({ theme }) => ({
  width: "100%",
  fontFamily: "Montserrat",
  padding: 25,
  paddingBottom: 15,
  paddingTop: 0,
  textAlign: "justify",
}));

const MarketData = styled(Box)(({ theme }) => ({
  alignSelf: "start",
  padding: 25,
  paddingTop: 10,
  width: "100%",
  [theme.breakpoints.down("md")]: {
    display: "flex",
    justifyContent: "space-around",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
  [theme.breakpoints.down("xs")]: {
    alignItems: "start",
  },
}));

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currency]);

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <Container>
      <Sidebar>
        <img
          src={coin?.image?.large || "/placeholder.jpg"} // Fallback to a placeholder image
          alt={coin?.name || "Coin image"}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Heading variant="h3">{coin?.name || "Loading..."}</Heading>
        <Description variant="subtitle1">
          {coin?.description?.en
            ? parse(coin?.description?.en.split(". ")[0])
            : "Loading description..."}
        </Description>
        <MarketData>
          <span style={{ display: "flex" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}
            >
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" sx={{ fontFamily: "Montserrat" }}>
              {coin?.market_cap_rank
                ? numberWithCommas(coin?.market_cap_rank)
                : "Loading..."}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}
            >
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" sx={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {coin?.market_data?.current_price?.[currency.toLowerCase()]
                ? numberWithCommas(
                    coin?.market_data?.current_price?.[currency.toLowerCase()]
                  )
                : "Loading..."}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}
            >
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" sx={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {coin?.market_data?.market_cap?.[currency.toLowerCase()]
                ? numberWithCommas(
                    coin?.market_data?.market_cap?.[currency.toLowerCase()]
                      .toString()
                      .slice(0, -6)
                  ) + " M"
                : "Loading..."}
            </Typography>
          </span>
        </MarketData>
      </Sidebar>
      <CoinInfo coin={coin} />
    </Container>
  );
};

export default CoinPage;
