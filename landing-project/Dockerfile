# Usa una imagen base oficial de Node
FROM node:22

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y el lockfile
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Construye la aplicación Astro
RUN npm run build

# Expone el puerto que usa Astro para servir
EXPOSE 4321

# Comando para ejecutar Astro en modo preview (producción)
CMD ["npm", "run", "preview"]
