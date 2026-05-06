import imageCompression from 'browser-image-compression';

/**
 * Comprime uma imagem para padrões web otimizados.
 * @param file Arquivo original
 * @param maxWidth Largura máxima (padrão 1920px)
 * @returns Arquivo comprimido
 */
export async function compressImage(file: File, maxWidth = 1920): Promise<File> {
    const options = {
        maxSizeMB: 1, // Tenta manter abaixo de 1MB
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: 'image/jpeg' // Força JPEG para maior compatibilidade e compressão
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log(`Imagem otimizada: de ${(file.size / 1024 / 1024).toFixed(2)}MB para ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        
        // Mantém o nome original mas garante a extensão correta se necessário
        return new File([compressedFile], file.name, {
            type: compressedFile.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error("Erro na compressão:", error);
        return file; // Se der erro, retorna o original para não travar o sistema
    }
}
