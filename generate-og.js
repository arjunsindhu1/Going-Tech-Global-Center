import { Jimp, loadFont, measureText } from 'jimp';
import path from 'path';

async function generateOgImage() {
  try {
    console.log('Starting programmatic OG image generation with Jimp...');
    
    // Create a blank 1200x630 white image
    const width = 1200;
    const height = 630;
    const image = new Jimp({ width, height, color: 0xFFFFFFFF }); // White background
    
    // Top and bottom premium accents (gradient blue to purple)
    const accentHeight = 12;
    for (let x = 0; x < width; x++) {
      const r = Math.round(8 + (116 * x / width));
      const g = Math.round(27 + (31 * x / width));
      const b = Math.round(140 + (97 * x / width));
      const color = (r << 24) | (g << 16) | (b << 8) | 0xFF;
      
      for (let y = 0; y < accentHeight; y++) {
        image.setPixelColor(color, x, y);
      }
      
      for (let y = height - accentHeight; y < height; y++) {
        image.setPixelColor(color, x, y);
      }
    }

    // Load the logo
    const logoPath = path.join(process.cwd(), 'public', 'GTGC Logo.png');
    console.log('Loading logo from:', logoPath);
    const logo = await Jimp.read(logoPath);
    
    // Resize logo to fit nicely (e.g., width of 340px)
    logo.resize({ w: 340 });
    
    // Centered position for logo
    const logoX = Math.round((width - logo.width) / 2);
    const logoY = 120; // Positioned beautifully at top-middle
    
    // Composite logo onto background
    image.composite(logo, logoX, logoY);
    
    // Load Fonts from CDN
    console.log('Loading fonts from CDN...');
    const font32 = await loadFont('https://unpkg.com/jimp@0.16.1/fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt');
    const font16 = await loadFont('https://unpkg.com/jimp@0.16.1/fonts/open-sans/open-sans-16-black/open-sans-16-black.fnt');
    
    // Line 1: "Going Technologies Global Center"
    const text1 = 'Going Technologies Global Center';
    const text1Width = measureText(font32, text1);
    const text1X = Math.round((width - text1Width) / 2);
    const text1Y = logoY + logo.height + 40; // 40px margin below logo
    
    image.print({ font: font32, x: text1X, y: text1Y, text: text1 });
    console.log('Printed Line 1:', text1);

    // Line 2: "Insurance Operations • Back Office Solutions • Global Delivery"
    // Use standard bullet characters that exist in standard BMFonts or fallback to mid-dots / hyphens
    const text2 = 'Insurance Operations * Back Office Solutions * Global Delivery';
    const text2Width = measureText(font16, text2);
    const text2X = Math.round((width - text2Width) / 2);
    const text2Y = text1Y + 55; // 55px margin below Line 1
    
    image.print({ font: font16, x: text2X, y: text2Y, text: text2 });
    console.log('Printed Line 2:', text2);
    
    // Save the final image to /public/featured_og_image.png
    const outputPath = path.join(process.cwd(), 'public', 'featured_og_image.png');
    await image.write(outputPath);
    
    console.log('Successfully generated premium OG featured image at:', outputPath);
  } catch (error) {
    console.error('Failed to generate OG image:', error);
  }
}

generateOgImage();
