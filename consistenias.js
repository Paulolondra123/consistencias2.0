const { execSync } = require('child_process');
const simpleGit = require('simple-git');
const path = require('path');

const repoUrl = 'https://github.com/Paulolondra123/consistencias2.0.git';
const localPath = path.resolve(__dirname, 'consistencias2.0');

async function setupApplication() {
  try {
    // Clonar el repositorio
    console.log('Clonando el repositorio...');
    await simpleGit().clone(repoUrl, localPath);

    // Cambiar al directorio del repositorio
    process.chdir(localPath);

    // Instalar dependencias
    console.log('Instalando dependencias...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('Aplicación instalada exitosamente.');
  } catch (error) {
    console.error('Error durante la instalación:', error);
  }
}

setupApplication();
