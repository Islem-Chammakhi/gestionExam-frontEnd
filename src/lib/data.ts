// TEMPORARY DATA


export type CoefficientKey = "ZERO_POINT_FIVE" | "ONE" | "ONE_POINT_FIVE" | "TWO";

export type DurationKey ="THREE" | "ONE" | "ONE_POINT_FIVE" | "TWO"

export const coefTable: Record<CoefficientKey, number> = {
  "ZERO_POINT_FIVE": 0.5,
  "ONE": 1,
  "ONE_POINT_FIVE": 1.5,
  "TWO": 2,
};

export const durationTable: Record<DurationKey, number> = {
  "THREE": 3,
  "ONE": 1,
  "ONE_POINT_FIVE": 1.5,
  "TWO": 2,
};

export const search = (data: any[], query: string, keys: string[]) => {
  if (!query) return data;
  
  const lowerQuery = query.toLowerCase();
  
  return data.filter((item) => {
    return keys.some((key) => {
      // Gestion des clés imbriquées
      const value = key.split('.').reduce((obj, k) => obj?.[k], item);
      console.log(keys)
      // // Conversion des dates en format lisible si nécessaire
      // if (value instanceof Date || key.includes('_time')) {
      //   return new Date(value).toLocaleString().toLowerCase().includes(lowerQuery);
      // }
      
      // // Conversion des enums/constantes en string
      if (key === 'duration' || key === 'exam.duration') {
        return String(durationTable[value as DurationKey]).toLowerCase().includes(lowerQuery);
      }

      if (key === 'subject.coefficient' || key === 'exam.subject.coefficient') {
        return String(coefTable[value as CoefficientKey]).toLowerCase().includes(lowerQuery);
      }

      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
};