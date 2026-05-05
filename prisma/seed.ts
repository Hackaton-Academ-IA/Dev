import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error("La variable DATABASE_URL est absente du fichier .env");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Démarrage du seeding...');

  // 1. Création des Badges
  const badgesData = [
    { nom: 'Novice', icone: '🥚', xp_requis: 0 },
    { nom: 'Apprenti', icone: '🐣', xp_requis: 100 },
    { nom: 'Éclaireur', icone: '🐥', xp_requis: 500 },
    { nom: 'Expert', icone: '🐔', xp_requis: 1500 },
    { nom: 'Maître de l\'IA', icone: '👑', xp_requis: 5000 },
  ];

  console.log('Création des badges...');
  for (const badge of badgesData) {
    const existing = await prisma.badge.findFirst({ where: { nom: badge.nom } });
    if (!existing) {
      await prisma.badge.create({ data: badge });
      console.log(`Badge créé : ${badge.nom}`);
    } else {
      console.log(`Badge déjà existant : ${badge.nom}`);
    }
  }

  // 2. Création de quelques questions de base
  const questionsData = [
    {
      contenu: "Quel est l'objectif principal d'Academ'IA ?",
      difficulte: "facile",
      reponse_attendue: "L'apprentissage personnalisé via l'IA"
    },
    {
      contenu: "Quelle technologie est utilisée pour le frontend d'Academ'IA ?",
      difficulte: "facile",
      reponse_attendue: "Next.js"
    },
    {
      contenu: "Quel moteur de base de données est utilisé ?",
      difficulte: "facile",
      reponse_attendue: "PostgreSQL"
    },
    {
      contenu: "Que signifie le 'XP' dans le système de gamification ?",
      difficulte: "moyen",
      reponse_attendue: "Points d'Expérience"
    },
    {
      contenu: "Comment l'IA adapte-t-elle la difficulté ?",
      difficulte: "difficile",
      reponse_attendue: "En temps réel selon les performances de l'utilisateur"
    }
  ];

  console.log('Création des questions...');
  for (const q of questionsData) {
    const existing = await prisma.question.findFirst({ where: { contenu: q.contenu } });
    if (!existing) {
      await prisma.question.create({ data: q });
      console.log(`Question créée : ${q.contenu.substring(0, 30)}...`);
    } else {
      console.log(`Question déjà existante.`);
    }
  }

  // 3. Création d'un utilisateur admin
  console.log('Création de l\'utilisateur admin...');
  const adminEmail = 'admin@academia.fr';
  const existingAdmin = await prisma.utilisateur.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    await prisma.utilisateur.create({
      data: {
        email: adminEmail,
        name: 'Administrateur AcademIA',
        role: 'admin',
        niveau: 10,
        xp: 10000,
        emailVerified: true,
      }
    });
    console.log(`Admin créé : ${adminEmail}`);
  } else {
    console.log(`Admin déjà existant : ${adminEmail}`);
  }

  console.log('✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
