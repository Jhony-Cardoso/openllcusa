const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const masterImagePath = process.argv[2];
const outputDir = path.join(__dirname, '..', 'public', 'social');

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

async function cropBanners() {
  const image = sharp(masterImagePath);
  const metadata = await image.metadata();
  
  // The generated master image is likely 1792 x 1024 (16:9).
  // We need to extract the center strip for panoramas.
  
  const width = metadata.width;
  const height = metadata.height;
  const centerY = Math.floor(height / 2);
  
  // Twitter: 1500x500 (3:1)
  const twitterHeight = Math.floor(width / 3);
  await image.clone()
    .extract({ 
      left: 0, 
      top: centerY - Math.floor(twitterHeight / 2), 
      width: width, 
      height: twitterHeight 
    })
    .resize(1500, 500)
    .toFile(path.join(outputDir, 'banner_twitter.jpg'));
    
  // LinkedIn: 1584x396 (4:1)
  const linkedinHeight = Math.floor(width / 4);
  await image.clone()
    .extract({ 
      left: 0, 
      top: centerY - Math.floor(linkedinHeight / 2), 
      width: width, 
      height: linkedinHeight 
    })
    .resize(1584, 396)
    .toFile(path.join(outputDir, 'banner_linkedin.jpg'));
    
  // Facebook: 820x312 (~2.62:1)
  const fbHeight = Math.floor(width / (820/312));
  await image.clone()
    .extract({ 
      left: 0, 
      top: centerY - Math.floor(fbHeight / 2), 
      width: width, 
      height: fbHeight 
    })
    .resize(820, 312)
    .toFile(path.join(outputDir, 'banner_facebook.jpg'));

  // YouTube: 2560x1440 (16:9) -> just resize the master
  await image.clone()
    .resize(2560, 1440)
    .toFile(path.join(outputDir, 'banner_youtube.jpg'));

  console.log("✅ Banners cropped successfully!");
}

cropBanners().catch(console.error);
