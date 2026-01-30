declare const pdfjsLib: any;

export const extractTextFromPdf = async (file: File): Promise<string> => {
  // Verificación de librería con reintento simple para móviles
  if (typeof pdfjsLib === 'undefined') {
    await new Promise(resolve => setTimeout(resolve, 500)); // Esperar medio segundo si no cargó el CDN
    if (typeof pdfjsLib === 'undefined') {
      throw new Error("ERROR_PDF_LIB: El motor de lectura no cargó. Refresca la página.");
    }
  }

  // Configurar worker si no está configurado
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
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

    // Analizamos hasta 4 páginas para no saturar la RAM del celular
    const maxPages = Math.min(pdf.numPages, 4);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }

    if (!fullText.trim() || fullText.length < 50) {
      throw new Error("ERROR_PDF_VACIO: El archivo parece ser una imagen o está vacío. Usa un PDF con texto.");
    }

    return fullText;
  } catch (error: any) {
    console.error("PDF Error:", error);
    throw new Error(`ERROR_PDF: ${error.message || 'No se pudo leer el archivo'}`);
  }
};