
/**
 * Ajusta a hora para o formato UTC
 */
export const formatDateToUTC = (dateString) => {

    const date = new Date(dateString);

    const isoString = date.toISOString();

    return isoString;
}