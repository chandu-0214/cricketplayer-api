const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
app.use(express.json());
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started at Localhost");
    });
  } catch (e) {
    console.log(`BD error :${e.message}`);
    process.exit(1);
  }
};

intializeDBAndServer();

// API 1

app.get("/players/", async (request, response) => {
  const getplayersArray = `
    
        select * from cricket_team order by player_id;

    `;
  const playersArray = await db.all(getplayersArray);
  response.send(playersArray);
});

// API 2

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

// API 3 return a selected player

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const selectedPlayerQuery = `
        select * from cricket_team where player_id = ${playerId};
    `;
  const singlePlayerDetails = await db.get(selectedPlayerQuery);
  response.send(singlePlayerDetails);
});

// API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatedPlayerQuery = `
         UPDATE
    cricket_team
  SET
   
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};
     
     `;
  await db.run(updatedPlayerQuery);
  respond.send("Updated Successfully");
});

// API 5 delete player_id
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
