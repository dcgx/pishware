export const extractHtmlFromRawEmail = (raw: any) => {
    // Extraer la sección Content-Type: text/html
    const htmlSectionMatch = raw.match(/Content-Type:\s*text\/html[^]*?(?=(\r?\n\r?\n))/i);
    if (!htmlSectionMatch) return null;

    // Extraer contenido después de los encabezados HTML
    const htmlContent = raw.split(htmlSectionMatch[0])[1]?.trim();

    if (!htmlContent) return null;

    // Decodificar quoted-printable (=3D -> =, =C3=B3 -> ó, etc.)
    return decodeQuotedPrintable(htmlContent);
}

// Función para decodificar quoted-printable
function decodeQuotedPrintable(input: any) {
    return input
        .replace(/=\r?\n/g, '') // línea partida
        .replace(/=([A-Fa-f0-9]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}
