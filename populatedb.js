#! /usr/bin/env node

console.log(
    'This script populates some test games and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

  // Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Genre = require("./models/genre");
const Game = require("./models/game");
const Company = require("./models/company");

const genres = [];
const games = [];
const companies = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCompanies();
    await createGenres();
    await createGames();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name, description) {
    const genre = new Genre({ name: name, description: description });
    await genre.save();
    genres[index] = genre;
    console.log(`Added genre: ${name}`);
}
  
async function gameCreate(index, name, company, description, genre, price, numberInStock) {
    const gameDetail = { name: name, company: company, description: description, genre: genre, price: price, numberInStock: numberInStock };
  
    const game = new Game(gameDetail);
  
    await game.save();
    games[index] = game;
    console.log(`Added game: ${name}`);
}

async function companyCreate(index, name) {
  const company = new Company({ name: name });

  await company.save();
  companies[index] = company;
  console.log(`Added company: ${name}`);
}

async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate(0, "Free to Play"),
      genreCreate(1, "Action"),
      genreCreate(2, "Adventure"),
      genreCreate(3, "Indie"),
      genreCreate(4, "RPG"),
      genreCreate(5, "Strategy"),
      genreCreate(6, "Simulation"),
    ]);
}
  
async function createGames() {
    console.log("Adding games");
    await Promise.all([
      gameCreate(0, "Destiny 2", companies[0],
        ["Dive into the world of Destiny 2 to explore the mysteries of the solar system and experience responsive first-person shooter combat. Unlock powerful elemental abilities and collect unique gear to customize your Guardian's look and playstyle. Enjoy Destiny 2’s cinematic story, challenging co-op missions, and a variety of PvP modes alone or with friends. Download for free today and write your legend in the stars."],
        [genres[0], genres[1], genres[2]], 0, 0
      ),
      gameCreate(1, 'Terraria', companies[1],
        ['Dig, Fight, Explore, Build: The very world is at your fingertips as you fight for survival, fortune, and glory. Will you delve deep into cavernous expanses in search of treasure and raw materials with which to craft ever-evolving gear, machinery, and aesthetics? Perhaps you will choose instead to seek out ever-greater foes to test your mettle in combat? Maybe you will decide to construct your own city to house the host of mysterious allies you may encounter along your travels?'],
        [genres[1], genres[2], genres[3], genres[4]], 9.99, 20
      ),
      gameCreate(2, "Overwatch 2", companies[2],
        ["Overwatch 2 is a free-to-play, always-on, and ever-evolving live game. Join each season of Overwatch 2 in a thrilling new PvP journey featuring fresh content, from new heroes and maps to events, storytelling, gameplay updates, and more."],
        [genres[0], genres[1]], 0, 0
      ),
      gameCreate(3, "7 Days to Die", companies[3],
        ["With over 16 million copies sold, 7 Days has defined the survival genre, with unrivaled crafting and world-building content. Set in a brutally unforgiving post-apocalyptic world overrun by the undead, 7 Days is an open-world game that is a unique combination of first-person shooter, survival horror, tower defense, and role-playing games. It presents combat, crafting, looting, mining, exploration, and character growth, in a way that has seen a rapturous response from fans worldwide. Play the definitive zombie survival sandbox RPG that came first. Navezgane awaits!"],
        [genres[1], genres[2], genres[3], genres[4], genres[5], genres[6]], 24.99, 40
      ),
      gameCreate(4, "Bloons TD 6", companies[4],
        ["Craft your perfect defense from a combination of powerful Monkey Towers and awesome Heroes, then pop every last invading Bloon!", 
        "Over a decade of tower defense pedigree and regular massive updates makes Bloons TD 6 a favorite game for millions of players. Enjoy endless hours of strategy gaming with Bloons TD 6!"],
        [genres[5]], 13.99, 25
      ),
      gameCreate(5, "Dead by Daylight", companies[5],
        ["Dead by Daylight is a multiplayer (4vs1) horror game where one player takes on the role of the savage Killer, and the other four players play as Survivors, trying to escape the Killer and avoid being caught, tortured and killed.", 
        "Survivors play in third-person and have the advantage of better situational awareness. The Killer plays in first-person and is more focused on their prey.", 
        "The Survivors' goal in each encounter is to escape the Killing Ground without getting caught by the Killer - something that sounds easier than it is, especially when the environment changes every time you play."],
        [genres[1]], 19.99, 45
      ),
      gameCreate(6, "Phasmophobia", companies[6],
        ["Phasmophobia is a 4-player, online co-op, psychological horror game. You and your team of paranormal investigators will enter haunted locations filled with paranormal activity and try to gather as much evidence as you can. Use your ghost-hunting equipment to find and record evidence to sell on to a ghost removal team."],
        [genres[1], genres[3]], 13.99, 30
      ),
      gameCreate(7, "Dying Light 2 Stay Human: Reloaded Edition", companies[7],
        ["It’s been 20 years since the events of the original game. The virus won, and humanity is slowly dying. You play as Aiden Caldwell, a wandering Pilgrim who delivers goods, brings news, and connects the few remaining survivor settlements in barren lands devastated by the zombie virus. However, your true goal is to find your little sister Mia, who you left behind as a kid to escape Dr. Waltz's torturous experiments. Haunted by the past, you eventually make the decision to confront it when you learn that Mia may still be alive in Villedor — the last city standing on Earth.",
         "You quickly find yourself in a settlement torn by conflict. You’ll need to engage in creative and gory combat, so hone your skills to defeat hordes of zombies and make allies. Roam the city, free run across Villedor’s buildings and rooftops in search of loot in remote areas, and be wary of the night. With every sunset, monsters take control of the streets."],
        [genres[1], genres[2], genres[4]], 59.99, 50
      ),
      gameCreate(8, "God of War", companies[8],
        ["His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same."],
        [genres[1], genres[2], genres[4]], 49.99, 40
      ),
      gameCreate(9, "The Forest", companies[9],
        ["As the lone survivor of a passenger jet crash, you find yourself in a mysterious forest battling to stay alive against a society of cannibalistic mutants. Build, explore, survive in this terrifying first person survival horror simulator."],
        [genres[1], genres[2], genres[3], genres[6]], 19.99, 25
      ),
      gameCreate(10, "Sons Of The Forest", companies[9],
        ["Sent to find a missing billionaire on a remote island, you find yourself in a cannibal-infested hellscape. Craft, build, and struggle to survive, alone or with friends, in this terrifying new open-world survival horror simulator."],
        [genres[1], genres[2], genres[3], genres[6]], 29.99, 30
      ),
      gameCreate(11, "Resident Evil 4", companies[10],
        ["Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, one of the survivors, tracks the president's kidnapped daughter to a secluded European village, where there is something terribly wrong with the locals."],
        [genres[1], genres[2]], 39.99, 35
      ),
      gameCreate(12, "Call of Duty®: Black Ops III", companies[11],
        ["The Future of Combat. Black Ops III engrosses players in a dark and gritty future, where a new breed of Black Ops soldier has emerged, and the lines between humanity and military technology have been blurred. You must navigate the hot spots of a new Cold War to find your missing brothers."],
        [genres[1], genres[2]], 59.99, 20
      ),
      gameCreate(13, "Call of Duty®: Black Ops II", companies[11],
        ["Pushing the boundaries of what fans have come to expect from the record-setting entertainment franchise, Call of Duty®: Black Ops II propels players into a near future, 21st Century Cold War, where technology and weapons have converged to create a new generation of warfare."],
        [genres[1]], 59.99, 20
      ),
      gameCreate(14, "Call of Duty®: Modern Warfare® 3 (2011)", companies[11],
        ["The best-selling first person action series of all-time returns with the epic sequel to multiple “Game of the Year” award winner, Call of Duty®: Modern Warfare® 2. In the world’s darkest hour, are you willing to do what is necessary? Prepare yourself for a cinematic thrill-ride only Call of Duty can deliver. The definitive Multiplayer experience returns bigger and better than ever, loaded with new maps, modes and features. Co-Op play has evolved with all-new Spec-Ops missions and leaderboards, as well as Survival Mode, an action-packed combat progression unlike any other."],
        [genres[1]], 39.99, 22
      ),
      gameCreate(14, "Call of Duty®: Black Ops", companies[11],
        ["Call of Duty®: Black Ops will take you behind enemy lines as a member of an elite special forces unit engaging in covert warfare, classified operations, and explosive conflicts across the globe. With access to exclusive weaponry and equipment, your actions will tip the balance during the most dangerous time period mankind has ever known."],
        [genres[1]], 39.99, 19
      ),
      gameCreate(14, "Call of Duty®: Modern Warfare® 2 (2009)", companies[11],
        ["The most-anticipated game of the year and the sequel to the best-selling first-person action game of all time, Modern Warfare 2 continues the gripping and heart-racing action as players face off against a new threat dedicated to bringing the world to the brink of collapse."],
        [genres[1]], 19.99, 19
      ),
      gameCreate(14, "Call of Duty® 4: Modern Warfare® (2007)", companies[11],
        ["Call of Duty 4: Modern Warfare arms gamers with an arsenal of advanced and powerful modern day firepower and transports them to the most treacherous hotspots around the globe to take on a rogue enemy group threatening the world."],
        [genres[1]], 19.99, 20
      ),
    ]);
}

async function createCompanies() {
    console.log("Adding companies");
    await Promise.all([
      companyCreate(0, "Bungie"),
      companyCreate(1, "Re-Logic"),
      companyCreate(2, "Blizzard Entertainment, Inc."),
      companyCreate(3, "The Fun Pimps Entertainment LLC"),
      companyCreate(4, "Ninja Kiwi"),
      companyCreate(5, "Behavior Interactive Inc."),
      companyCreate(6, "Kinetic Games"),
      companyCreate(7, "Techland"),
      companyCreate(8, "Santa Monica Studio"),
      companyCreate(9, "Endnight Games Ltd"),
      companyCreate(10, "CAPCOM Co., Ltd."),
      companyCreate(11, "Activision"),
    ]);
}