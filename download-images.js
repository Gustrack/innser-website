const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuración de imágenes a descargar
const imagesToDownload = {
    // Logos
    'logo-innser.png': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5V-qG3sf7PXAoCMTGMFkhmp16iqe00JyY4Q&s',
    
    // Heroes
    'hero-home.jpg': 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'hero-about.jpg': 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    
    // Servicios
    'service-equipamiento.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSInB42hgmtcfStT0P0w4zo22dq23FKP5PK4Q&s',
    'service-plantas.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMhX1CFf07mXOMPwuzeN0ptKmOukDpaGTtFQ&s',
    'service-ahorro.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdp2IWjmpQvLPzKw4wPH8D3Vz7tJHbGhoilg&s',
    'service-auditoria.jpg': 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'service-optimizacion.jpg': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'service-renovables.jpg': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    
    // Team
    'team-carlos.jpg': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'team-ana.jpg': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'team-miguel.jpg': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    
    // Clients/Testimonials
    'client-1.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    'client-2.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    'client-3.jpg': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    
    // Casos de estudio
    'case-industrial.jpg': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    'case-oficinas.jpg': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    
    // Eficiencia energética
    'eficiencia-solar.jpg': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'eficiencia-eolica.jpg': 'https://images.unsplash.com/photo-1496861083950-6a51dfa1d2f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
};

// Crear directorios necesarios
const directories = [
    'assets/images/logo',
    'assets/images/heroes',
    'assets/images/team',
    'assets/images/services',
    'assets/images/clients',
    'assets/images/cases',
    'assets/images/eficiencia'
];

// Función para crear directorios recursivamente
function createDirectories() {
    console.log('📁 Creando estructura de carpetas...');
    
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Carpeta creada: ${dir}`);
        } else {
            console.log(`📂 Carpeta existente: ${dir}`);
        }
    });
    console.log('');
}

// Función para descargar una imagen
function downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            // Verificar que la respuesta sea exitosa
            if (response.statusCode !== 200) {
                reject(new Error(`Error ${response.statusCode} al descargar: ${url}`));
                return;
            }

            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve(filePath);
            });
            
            file.on('error', (err) => {
                fs.unlink(filePath, () => {}); // Eliminar archivo parcialmente descargado
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Función principal para descargar todas las imágenes
async function downloadAllImages() {
    console.log('🚀 Iniciando descarga de imágenes...\n');
    
    createDirectories();
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [filename, url] of Object.entries(imagesToDownload)) {
        try {
            // Determinar la carpeta destino basado en el nombre del archivo
            let folder = 'assets/images/';
            if (filename.includes('logo')) folder += 'logo/';
            else if (filename.includes('hero')) folder += 'heroes/';
            else if (filename.includes('team')) folder += 'team/';
            else if (filename.includes('client')) folder += 'clients/';
            else if (filename.includes('case')) folder += 'cases/';
            else if (filename.includes('eficiencia')) folder += 'eficiencia/';
            else folder += 'services/';
            
            const filePath = folder + filename;
            
            console.log(`⬇️  Descargando: ${filename}`);
            await downloadImage(url, filePath);
            console.log(`✅ Descargado: ${filename}`);
            successCount++;
            
        } catch (error) {
            console.log(`❌ Error al descargar ${filename}: ${error.message}`);
            errorCount++;
        }
    }
    
    console.log('\n📊 Resumen de descargas:');
    console.log(`✅ Éxitos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Total: ${successCount + errorCount} imágenes`);
    
    if (errorCount > 0) {
        console.log('\n💡 Algunas imágenes pudieron fallar debido a restricciones de CORS o URLs inválidas.');
        console.log('   Puedes reemplazarlas manualmente con imágenes locales.');
    }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
    downloadAllImages().catch(console.error);
}

module.exports = { downloadAllImages };