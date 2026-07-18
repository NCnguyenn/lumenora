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

cat_map = {
    'p1': 'skin', 'p2': 'skin', 'p3': 'skin', 'p4': 'body', 'p5': 'body',
    'p6': 'body', 'p7': 'skin', 'p8': 'skin', 'p9': 'skin', 'p10': 'skin',
    'p11': 'sun', 'p12': 'skin', 'p13': 'fragrance', 'p14': 'fragrance',
    'p15': 'body', 'p16': 'sun', 'p17': 'sun', 'p18': 'sun', 'p19': 'fragrance', 'p20': 'fragrance'
}

query_map = {
    'skin': 'skincare,cosmetics,luxury',
    'body': 'spa,bodylotion,luxury',
    'sun': 'sunscreen,summer,skincare',
    'fragrance': 'perfume,luxury,bottle'
}

def download_placeholder(slug, id_str, role, seed):
    cat = cat_map.get(id_str, 'skin')
    query = query_map[cat]
    if role == 'detail':
        query = query + ",macro,texture"
    
    url = f"https://loremflickr.com/960/960/{query}/all?random={seed}"
    print(f"Downloading {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            img_data = response.read()
        return Image.open(io.BytesIO(img_data)).convert('RGB')
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        # Fallback to solid color
        return Image.new('RGB', (960, 960), color='#F4F0E8')

seed_counter = 100

for item in prompts:
    id_str = item['id']
    slug = item['slug']
    target_dir = os.path.join(frontend_assets, slug)
    os.makedirs(target_dir, exist_ok=True)
    
    for role, idx in [('primary', '01'), ('hover', '02'), ('detail', '03')]:
        target_file = os.path.join(target_dir, f"{idx}-{role}.webp")
        
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
            seed_counter += 1
            img = download_placeholder(slug, id_str, role, seed_counter)
            img.save(target_file, 'WEBP', quality=85)
            print(f"[{id_str} {role}] Downloaded online placeholder -> {target_file}")
            time.sleep(0.5) # Prevent rate limiting from loremflickr

print("Phase 2 Image Update Complete.")
