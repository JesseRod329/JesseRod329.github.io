export const VILLA_SCALE = 1;

const palette = {
  public: 0xE0C097,   // Warm Travertine
  private: 0xC85A17,  // Pompeian Red / Terracotta
  service: 0x8D7B68,  // Muted Earth
  peristyle: 0xFFD700, // Gold/Yellow accents
  highlight: 0x660066, // Tyrian Purple (Royal)
  water: 0x00FFFF,
  garden: 0x2E8B57
};

export const rooms = [
  {
    name: 'Tablinum',
    x: -32,
    z: 14,
    width: 18,
    depth: 10,
    height: 5,
    color: palette.highlight,
    description: "The office or study of the paterfamilias. Here, Julius Caesar would receive clients and conduct business. It sits between the atrium and the peristyle, symbolizing the connection between public and private life."
  },
  {
    name: 'West Atrium',
    x: -32,
    z: 0,
    width: 18,
    depth: 12,
    height: 6,
    color: palette.public,
    description: "A secondary atrium, likely for more private family gatherings or specific guests. The high ceilings and compluvium allowed light and rain to enter."
  },
  {
    name: 'Vestibulum',
    x: -32,
    z: -12,
    width: 18,
    depth: 8,
    height: 4,
    color: palette.public,
    description: "The grand entrance hall. First impressions mattered in Rome; this space was designed to impress visitors with the wealth and status of the Julian clan."
  },
  {
    name: 'Fauces',
    x: -2,
    z: -18,
    width: 42,
    depth: 8,
    height: 4,
    color: palette.public,
    description: "The 'throat' of the house, a narrow corridor leading from the street to the main atrium. Often decorated with mosaics to welcome guests."
  },
  {
    name: 'Central Atrium',
    x: -6,
    z: 6,
    width: 24,
    depth: 16,
    height: 7,
    color: palette.public,
    description: "The heart of the Roman house. This grand space featured an impluvium to catch rainwater and served as the central hub for daily life and social rituals."
  },
  {
    name: 'Impluvium Terrace',
    x: -6,
    z: 6,
    width: 10,
    depth: 6,
    height: 2.5,
    color: 0x4FA3A5, // Watery teal
    description: "A decorative pool reflecting the sky above. It cooled the air and provided a serene focal point for the bustling atrium."
  },
  {
    name: 'Tablinum Approach',
    x: -16,
    z: 10,
    width: 8,
    depth: 6,
    height: 4,
    color: palette.public,
    description: "An antechamber leading to the Tablinum, offering a moment of pause before entering the master's study."
  },
  {
    name: 'Triclinium',
    x: 6,
    z: -6,
    width: 26,
    depth: 12,
    height: 5,
    color: palette.private,
    description: "The formal dining room. Romans reclined on couches (kline) while eating, discussing politics, philosophy, and enjoying entertainment."
  },
  {
    name: 'Peristyle North Walk',
    x: 12,
    z: 18,
    width: 26,
    depth: 4,
    height: 4.5,
    color: palette.public,
    description: "A shaded colonnade surrounding the garden. Perfect for a contemplative walk (ambulatio) away from the heat of the sun."
  },
  {
    name: 'Peristyle South Walk',
    x: 12,
    z: -2,
    width: 26,
    depth: 4,
    height: 4.5,
    color: palette.public,
    description: "The southern arm of the colonnade, connecting the dining areas to the private quarters."
  },
  {
    name: 'Peristyle West Walk',
    x: 0,
    z: 8,
    width: 4,
    depth: 20,
    height: 4.5,
    color: palette.public,
    description: "The western walkway, bridging the public atrium and the private garden sanctuary."
  },
  {
    name: 'Peristyle East Walk',
    x: 24,
    z: 8,
    width: 4,
    depth: 20,
    height: 4.5,
    color: palette.public,
    description: "The eastern walkway, providing access to the most private family chambers."
  },
  {
    name: "Livia's Chambers",
    x: 34,
    z: 18,
    width: 16,
    depth: 6,
    height: 4.5,
    color: palette.highlight,
    description: "Private quarters, possibly for the lady of the house. Decorated with fine frescoes and luxurious furnishings."
  },
  {
    name: 'Master Cubiculum',
    x: 34,
    z: 10,
    width: 16,
    depth: 6,
    height: 4.5,
    color: palette.highlight,
    description: "The master bedroom. Small by modern standards, but intensely private and often beautifully decorated for rest."
  },
  {
    name: 'Apodyterium',
    x: 34,
    z: 2,
    width: 16,
    depth: 6,
    height: 4,
    color: palette.private,
    description: "A changing room, likely part of a private bath suite (balneum). A luxury for a wealthy Roman villa."
  },
  {
    name: 'Culina',
    x: 34,
    z: -6,
    width: 16,
    depth: 6,
    height: 4,
    color: palette.service,
    description: "The kitchen. A hot, smoky, busy room where slaves prepared elaborate meals for the Triclinium."
  },
  {
    name: 'Servant & Utility Rooms',
    x: 34,
    z: -14,
    width: 16,
    depth: 6,
    height: 4,
    color: palette.service,
    description: "Quarters for the household slaves and storage for the villa's operations. Essential but kept out of sight."
  },
];

export const courtyard = {
  center: { x: 12, z: 8 },
  width: 14,
  depth: 14,
  fountainRadius: 3,
};

export const columnPositions = (() => {
  const { center, width, depth } = courtyard;
  const halfW = width / 2;
  const halfD = depth / 2;
  const step = 6;
  const coords = [];

  for (let x = center.x - halfW; x <= center.x + halfW; x += step) {
    coords.push({ x, z: center.z - halfD });
    coords.push({ x, z: center.z + halfD });
  }

  for (let z = center.z - halfD + step; z <= center.z + halfD - step; z += step) {
    coords.push({ x: center.x - halfW, z });
    coords.push({ x: center.x + halfW, z });
  }

  return coords;
})();

export const highlightableRooms = rooms.map((room) => room.name);
