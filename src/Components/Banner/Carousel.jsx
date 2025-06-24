import { makeStyles } from "@mui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none", // Remove underline from links
    color: "white",
  },
  coinSymbol: {
    color: "white", // Coin symbol color (white)
    fontWeight: "bold",
  },
  coinPercentage: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  positivePercentage: {
    color: "green", // Positive change percentage color
  },
  negativePercentage: {
    color: "red", // Negative change percentage color
  },
  coinPrice: {
    fontSize: "22px",
    fontWeight: "500",
    color: "white", // Current price color (white)
  },
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
 
const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const classes = useStyles();

  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));

    setTrending(data);
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link to={`/coins/${coin.id}`} className={classes.carouselItem}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span className={classes.coinSymbol}>
          {coin?.symbol} &nbsp;
          <span
            className={`${classes.coinPercentage} ${
              profit ? classes.positivePercentage : classes.negativePercentage
            }`}
          >
            {profit && "+"} {coin.price_change_percentage_24h?.toFixed(2)}%{" "}
          </span>
          <span className={classes.coinPrice}>
            {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
          </span>
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
