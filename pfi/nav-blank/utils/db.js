import * as SQLite from 'expo-sqlite';

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync('pfi_auto.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Client (
      nom TEXT PRIMARY KEY NOT NULL,
      mdp TEXT NOT NULL,
      admin INTEGER NOT NULL,
      adresse TEXT,
      langue TEXT DEFAULT 'auto'
    );
    CREATE TABLE IF NOT EXISTS Produit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      description TEXT,
      prix REAL NOT NULL,
      image TEXT
    );
  `);

  // Seed default data if empty
  const clients = await db.getAllAsync('SELECT * FROM Client');
  if (clients.length === 0) {
    await db.runAsync("INSERT INTO Client (nom, mdp, admin, adresse, langue) VALUES (?, ?, ?, ?, ?)", 
      ['admin', 'admin123', 1, '123 Rue Admin', 'fr']);
    await db.runAsync("INSERT INTO Client (nom, mdp, admin, adresse, langue) VALUES (?, ?, ?, ?, ?)", 
      ['client', 'client123', 0, '456 Rue Client', 'en']);
  }

  const produits = await db.getAllAsync('SELECT * FROM Produit');
  if (produits.length === 0) {
    const defaultProducts = [
      ['Tesla Model S', 'Berline électrique haut de gamme', 85000, 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Tesla_Model_S_%28Facelift_ab_04-2016%29_%28cropped%29.jpg'],
      ['BMW M4', 'Coupé sportif haute performance', 75000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400'],
      ['Audi R8', 'Supercar avec moteur V10', 160000, 'https://images.pistonheads.com/nimg/46501-large.jpg'],
      ['Mercedes G-Class', 'SUV tout-terrain de luxe', 140000, 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=400'],
      ['Porsche 911', 'L\'icône des voitures de sport', 110000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400'],
      ['Ferrari F8', 'Sportive italienne à moteur central', 280000, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=400'],
      ['Lamborghini Huracan', 'V10 atmosphérique rageur', 250000, 'https://upload.wikimedia.org/wikipedia/commons/c/ca/2017_Lamborghini_Huracan_LP610.jpg']
    ];
    for (const p of defaultProducts) {
      await db.runAsync("INSERT INTO Produit (nom, description, prix, image) VALUES (?, ?, ?, ?)", p);
    }
  }
  return db;
}
