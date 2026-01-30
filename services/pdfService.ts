declare const pdfjsLib: any;

// Configuración global del worker una sola vez
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
  if (typeof pdfjsLib === 'undefined') {
    throw new Error("Librería de lectura de PDF no disponible.");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: true,
      isEvalSupported: false 
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';

    // Límite de seguridad para móviles: analizar hasta 5 páginas para evitar crashes
    const maxPages = Math.min(pdf.numPages, 5);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    if (!fullText.trim()) {
      throw new Error("No se pudo extraer texto del PDF (podría ser una imagen).");
    }

    return fullText;
  } catch (error) {
    console.error("Error extrayendo texto del PDF:", error);
    throw error;
  }
};