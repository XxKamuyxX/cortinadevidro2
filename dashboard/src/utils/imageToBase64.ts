/**
 * Converts an image URL to base64 string to avoid CORS issues in PDF generation
 * @param imageUrl - The URL of the image to convert
 * @returns Promise<string> - The base64 data URL of the image, or null if conversion fails
 */
export const getBase64ImageFromUrl = async (imageUrl: string): Promise<string | null> => {
  if (!imageUrl || !imageUrl.trim()) {
    return null;
  }

  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    
    if (!response.ok) {
      console.warn('Failed to fetch image:', response.statusText);
      return null;
    }

    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => {
        console.warn('Error reading image blob:', reader.error);
        resolve(null); // Fallback: don't crash, just return null
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Error converting image to base64:', error);
    // Fallback: don't crash, just return null
    return null;
  }
};
