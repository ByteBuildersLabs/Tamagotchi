/**
 * Loads a single image asynchronously.
 * @param src The path to the image.
 * @returns A promise that resolves with the loaded HTMLImageElement.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error(`Failed to load image: ${src}. Error: ${err}`));
      img.src = src;
    });
  }
  
  /**
   * Loads multiple images asynchronously.
   * @param paths An array of image paths.
   * @returns A promise that resolves with an array of loaded HTMLImageElements.
   */
  export async function loadImages(paths: string[]): Promise<HTMLImageElement[]> {
    try {
      const imagePromises = paths.map(path => loadImage(path));
      const images = await Promise.all(imagePromises);
      return images;
    } catch (error) {
      console.error("Error loading one or more images:", error);
      // You could decide to return an empty array or placeholders if some fail,
      // or rethrow the error to prevent the game from starting.
      // For now, we rethrow to make the failure evident.
      throw error;
    }
  }
  
  /**
   * Loads an object of assets where the keys are descriptive names and the values are paths.
   * @param assetPaths An object where the keys are strings and the values are image paths.
   * @returns A promise that resolves with an object where the keys are the same
   * and the values are the loaded HTMLImageElements.
   */
  export async function loadNamedAssets(assetPaths: Record<string, string>): Promise<Record<string, HTMLImageElement>> {
    const loadedAssets: Record<string, HTMLImageElement> = {};
    const promises = [];
    const keys = Object.keys(assetPaths);
  
    for (const key of keys) {
      promises.push(
        loadImage(assetPaths[key]).then(img => {
          loadedAssets[key] = img;
        })
      );
    }
  
    await Promise.all(promises);
    return loadedAssets;
  }
