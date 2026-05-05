export type DungeonType = "dungeon" | "boss" | "start";
export type DonjonStatus = "LOCKED" | "UNLOCKED" | "COMPLETED";

export interface Dungeon {
  id: number;
  name: string;
  x: number;
  y: number;
  type: DungeonType;
  iconName: string;
  color: string;
  xpReward: number;
  difficulty: string;
}

export const DUNGEON_COUNT = 25;
export const MAP_HEIGHT = 3400;

// XP reward formula: regular = round(15 * N^1.2), boss = round(100 * N^1.5 / 4)
// Boss every 5 dungeons (ids 5, 10, 15, 20, 25)
export const DUNGEONS: Dungeon[] = [
  { id: 1,  name: "Le Commencement",           x: 50, y: 3250, type: "start",   iconName: "Trophy",    color: "#ffd23a", xpReward: 20,   difficulty: "1/10" },
  { id: 2,  name: "Forêt des Murmures",        x: 28, y: 3120, type: "dungeon", iconName: "Castle",    color: "#1eea7c", xpReward: 30,   difficulty: "2/10" },
  { id: 3,  name: "Grottes de Cristal",        x: 70, y: 2990, type: "dungeon", iconName: "Mountain",  color: "#22a7ff", xpReward: 45,   difficulty: "3/10" },
  { id: 4,  name: "Marais Toxique",            x: 35, y: 2860, type: "dungeon", iconName: "Skull",     color: "#ff3aa3", xpReward: 65,   difficulty: "3/10" },
  { id: 5,  name: "Forteresse de Fer",         x: 60, y: 2730, type: "boss",    iconName: "Swords",    color: "#ff4d4d", xpReward: 180,  difficulty: "5/10" },
  { id: 6,  name: "Pics Glacés",               x: 25, y: 2600, type: "dungeon", iconName: "Snowflake", color: "#22a7ff", xpReward: 85,   difficulty: "4/10" },
  { id: 7,  name: "Ruines du Désert",          x: 68, y: 2470, type: "dungeon", iconName: "Sun",       color: "#ff9a3a", xpReward: 105,  difficulty: "4/10" },
  { id: 8,  name: "Sanctuaire des Étoiles",    x: 38, y: 2340, type: "dungeon", iconName: "Star",      color: "#b14bff", xpReward: 130,  difficulty: "5/10" },
  { id: 9,  name: "Nébuleuse des Verbes",      x: 72, y: 2210, type: "dungeon", iconName: "Globe",     color: "#1eea7c", xpReward: 155,  difficulty: "5/10" },
  { id: 10, name: "Tour de l'Orage",           x: 50, y: 2080, type: "boss",    iconName: "Zap",       color: "#ff4d4d", xpReward: 420,  difficulty: "6/10" },
  { id: 11, name: "Crypte des Algorithmes",    x: 28, y: 1950, type: "dungeon", iconName: "Cpu",       color: "#22a7ff", xpReward: 190,  difficulty: "6/10" },
  { id: 12, name: "Plaine des Philosophes",    x: 65, y: 1820, type: "dungeon", iconName: "Eye",       color: "#ffd23a", xpReward: 225,  difficulty: "6/10" },
  { id: 13, name: "Sommet de la Logique",      x: 35, y: 1690, type: "dungeon", iconName: "Mountain",  color: "#1eea7c", xpReward: 265,  difficulty: "7/10" },
  { id: 14, name: "Labyrinthe Cybernétique",   x: 72, y: 1560, type: "dungeon", iconName: "Cpu",       color: "#ff3aa3", xpReward: 310,  difficulty: "7/10" },
  { id: 15, name: "Oracle de l'Abîme",         x: 50, y: 1430, type: "boss",    iconName: "Eye",       color: "#ff4d4d", xpReward: 800,  difficulty: "7/10" },
  { id: 16, name: "Vallée Quantique",          x: 30, y: 1300, type: "dungeon", iconName: "Atom",      color: "#22a7ff", xpReward: 370,  difficulty: "8/10" },
  { id: 17, name: "Delta de l'Entropie",       x: 68, y: 1170, type: "dungeon", iconName: "Flame",     color: "#ff9a3a", xpReward: 435,  difficulty: "8/10" },
  { id: 18, name: "Colisée des Érudits",       x: 38, y: 1040, type: "dungeon", iconName: "Swords",    color: "#b14bff", xpReward: 505,  difficulty: "8/10" },
  { id: 19, name: "Archive Temporelle",        x: 72, y: 910,  type: "dungeon", iconName: "Star",      color: "#1eea7c", xpReward: 585,  difficulty: "9/10" },
  { id: 20, name: "Nexus de l'Infini",         x: 50, y: 780,  type: "boss",    iconName: "Zap",       color: "#ff4d4d", xpReward: 1400, difficulty: "9/10" },
  { id: 21, name: "Zénith Algébrique",         x: 28, y: 650,  type: "dungeon", iconName: "Atom",      color: "#22a7ff", xpReward: 680,  difficulty: "9/10" },
  { id: 22, name: "Sphère des Axiomes",        x: 65, y: 520,  type: "dungeon", iconName: "Globe",     color: "#ffd23a", xpReward: 770,  difficulty: "9/10" },
  { id: 23, name: "Conscience Artificielle",   x: 35, y: 390,  type: "dungeon", iconName: "Cpu",       color: "#ff3aa3", xpReward: 870,  difficulty: "9/10" },
  { id: 24, name: "Salle de l'Éternité",       x: 68, y: 260,  type: "dungeon", iconName: "Castle",    color: "#b14bff", xpReward: 980,  difficulty: "10/10" },
  { id: 25, name: "LE TITAN DES SAVOIRS",      x: 50, y: 130,  type: "boss",    iconName: "Skull",     color: "#ff4d4d", xpReward: 2500, difficulty: "10/10" },
];
