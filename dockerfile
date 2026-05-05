# Utilise l'image officielle Node.js
FROM node:18-alpine

WORKDIR /app

# Copie les fichiers de dépendances
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers du projet
COPY . .

# Expose le port 3000
EXPOSE 3000

# Lance l'application en mode développement
CMD ["npm", "run", "dev"]