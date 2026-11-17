import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=200");
    const pokemons = response.data.results;
    const result = [];

    for (let i = 0; i < pokemons.length; i++) {
      const details = await axios.get(pokemons[i].url);
      const p = details.data;

      result[i] = {
        name: p.name,
        image: p.sprites.other["official-artwork"].front_default,
        health: p.stats[0].base_stat,
        power: p.stats[1].base_stat,
        defense: p.stats[2].base_stat,
        type: p.types[0].type.name,
      };
    }

    res.render("index.ejs", { data: result });
  } catch (error) {
    console.log("The fetching of API data is failed", error.message);
    res.render("index.ejs", { error: error.message });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`This server uses port ${port}`);
});

