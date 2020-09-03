const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = 8000;
const MOVIES = require("./movies-data-small.json");

app.use(morgan("dev"));
app.use(validateBearerToken);

app.get("/movie", handleGetMovies);

function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized Request" });
  }
  next();
}

function handleGetMovies(req, res) {
  let response = MOVIES;

  if (req.query.genre) {
    response = response.filter((movie) => {
      return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase());
    });
  }

  if (req.query.country) {
    response = response.filter((movie) => {
      return movie.country
        .toLowerCase()
        .includes(req.query.country.toLowerCase());
    });
  }

  if (req.query.avg_vote) {
    response = response.filter((movie) => {
      return movie.avg_vote >= req.query.avg_vote;
    });
  }

  res.json(response);
}

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
