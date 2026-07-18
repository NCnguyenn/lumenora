import os
import json
import glob
from PIL import Image
import urllib.request
import io
import time

base_dir = r"D:\Personal_Project\Lumenora"
json_path = os.path.join(base_dir, "image_prompts.json")
frontend_assets = os.path.join(base_dir, "Frontend", "public", "assets", "products")
ai_images_dir = r"C:\Users\CHI NGUYEN\.gemini\antigravity\brain\4a224687-11f7-4545-9c0d-ac29ef5e47ad"

with open(json_path, 'r') as f:
    prompts = json.load(f)

urls = [
  "https://images.pexels.com/photos/13186049/pexels-photo-13186049.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/16372665/pexels-photo-16372665/free-photo-of-disposable-bottle-of-cosmetics.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/16378446/pexels-photo-16378446/free-photo-of-pump-bottles-with-skincare-products.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/16233812/pexels-photo-16233812/free-photo-of-vials-of-cosmetics.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/34159010/pexels-photo-34159010/free-photo-of-three-cosmetic-bottles-on-white-surface.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/16378451/pexels-photo-16378451/free-photo-of-a-bottle-with-a-cosmetic-product.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7317074/pexels-photo-7317074.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7317036/pexels-photo-7317036.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8789599/pexels-photo-8789599.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7317088/pexels-photo-7317088.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8903264/pexels-photo-8903264.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7670680/pexels-photo-7670680.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/28752006/pexels-photo-28752006/free-photo-of-minimalist-beauty-product-arrangement.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7317086/pexels-photo-7317086.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8102290/pexels-photo-8102290.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/6167446/pexels-photo-6167446.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/31812004/pexels-photo-31812004/free-photo-of-lancome-advanced-genifique-serum-bottle.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/29611529/pexels-photo-29611529/free-photo-of-luxurious-skincare-products-on-white-background.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/10514764/pexels-photo-10514764.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8100691/pexels-photo-8100691.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8709600/pexels-photo-8709600.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/15785493/pexels-photo-15785493/free-photo-of-soap-in-bottles.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7317034/pexels-photo-7317034.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/12352170/pexels-photo-12352170.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7797007/pexels-photo-7797007.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7317087/pexels-photo-7317087.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/4841339/pexels-photo-4841339.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8100776/pexels-photo-8100776.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/6767787/pexels-photo-6767787.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7317072/pexels-photo-7317072.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8101512/pexels-photo-8101512.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/16378444/pexels-photo-16378444/free-photo-of-vial-and-bottle-of-cosmetics-on-white-background.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/13516791/pexels-photo-13516791.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8102140/pexels-photo-8102140.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/13516790/pexels-photo-13516790.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/29642374/pexels-photo-29642374/free-photo-of-elegant-cream-bottle-on-stylish-white-surface.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7615819/pexels-photo-7615819.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/6167865/pexels-photo-6167865.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/6167872/pexels-photo-6167872.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/6167866/pexels-photo-6167866.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/8102021/pexels-photo-8102021.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/7670694/pexels-photo-7670694.jpeg?auto=format&fit=crop&w=1200&h=1200",
  "https://images.pexels.com/photos/14395194/pexels-photo-14395194.jpeg?auto=format&fit=crop&w=1200&h=1200"
]

url_index = 0

def download_and_crop(url):
    print(f"Downloading {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            img_data = response.read()
        
        img = Image.open(io.BytesIO(img_data)).convert('RGB')
        
        # Ensure 1:1 crop
        width, height = img.size
        min_dim = min(width, height)
        left = (width - min_dim) / 2
        top = (height - min_dim) / 2
        right = (width + min_dim) / 2
        bottom = (height + min_dim) / 2
        
        img = img.crop((left, top, right, bottom))
        
        # Resize to 960x960
        img = img.resize((960, 960), Image.Resampling.LANCZOS)
        return img
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return Image.new('RGB', (960, 960), color='#F4F0E8')

for item in prompts:
    id_str = item['id']
    slug = item['slug']
    target_dir = os.path.join(frontend_assets, slug)
    os.makedirs(target_dir, exist_ok=True)
    
    for role, idx in [('primary', '01'), ('hover', '02'), ('detail', '03')]:
        target_file = os.path.join(target_dir, f"{idx}-{role}.webp")
        
        # Check if we already have an AI image
        ai_pattern = os.path.join(ai_images_dir, f"{id_str}_{role}_*.jpg")
        ai_files = glob.glob(ai_pattern)
        
        if ai_files:
            latest_file = sorted(ai_files)[-1]
            try:
                img = Image.open(latest_file)
                img.save(target_file, 'WEBP', quality=90)
                print(f"[{id_str} {role}] Saved AI image -> {target_file}")
            except Exception as e:
                print(f"Error converting AI image {latest_file}: {e}")
        else:
            # We need a fallback image, take next from list
            if url_index < len(urls):
                img = download_and_crop(urls[url_index])
                url_index += 1
            else:
                img = Image.new('RGB', (960, 960), color='#F4F0E8')
                
            img.save(target_file, 'WEBP', quality=85)
            print(f"[{id_str} {role}] Saved Pexels image -> {target_file}")
            time.sleep(0.5)

print(f"Phase 2 Image Update Complete. Used {url_index} pexels images.")
