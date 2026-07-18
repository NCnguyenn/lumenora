import os
import json
from PIL import Image, ImageDraw, ImageFont
import glob
import shutil

# Paths
base_dir = r"D:\Personal_Project\Lumenora"
json_path = os.path.join(base_dir, "image_prompts.json")
frontend_assets = os.path.join(base_dir, "Frontend", "public", "assets", "products")
ai_images_dir = r"C:\Users\CHI NGUYEN\.gemini\antigravity\brain\4a224687-11f7-4545-9c0d-ac29ef5e47ad"

# Design tokens
colors = {
    'skin': '#F4F0E8',     # ivory
    'body': '#E8E0D2',     # parchment
    'sun': '#8A7452',      # brass
    'fragrance': '#181713' # charcoal
}
text_colors = {
    'skin': '#181713',
    'body': '#6B1F2B',     # oxblood
    'sun': '#181713',
    'fragrance': '#F4F0E8'
}

with open(json_path, 'r') as f:
    prompts = json.load(f)

# Hardcode categories for color mapping
cat_map = {
    'p1': 'skin', 'p2': 'skin', 'p3': 'skin', 'p4': 'body', 'p5': 'body',
    'p6': 'body', 'p7': 'skin', 'p8': 'skin', 'p9': 'skin', 'p10': 'skin',
    'p11': 'sun', 'p12': 'skin', 'p13': 'fragrance', 'p14': 'fragrance',
    'p15': 'body', 'p16': 'sun', 'p17': 'sun', 'p18': 'sun', 'p19': 'fragrance', 'p20': 'fragrance'
}

def generate_placeholder(slug, id_str, role, text):
    cat = cat_map.get(id_str, 'skin')
    bg_color = colors[cat]
    txt_color = text_colors[cat]
    
    img = Image.new('RGB', (960, 960), color=bg_color)
    d = ImageDraw.Draw(img)
    
    # Try to load a font, otherwise use default
    try:
        font_large = ImageFont.truetype("arial.ttf", 60)
        font_small = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Draw text
    text_lines = [slug.replace('-', ' ').title(), f"Role: {role}", "(Quota Exceeded AI Fallback)"]
    y_text = 400
    for line in text_lines:
        try:
            # For newer Pillow versions
            bbox = d.textbbox((0, 0), line, font=font_large)
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
        except AttributeError:
            w, h = d.textsize(line, font=font_large)
        d.text(((960 - w) / 2, y_text), line, fill=txt_color, font=font_large)
        y_text += h + 20

    return img

# Process all 20 products
for item in prompts:
    id_str = item['id']
    slug = item['slug']
    target_dir = os.path.join(frontend_assets, slug)
    os.makedirs(target_dir, exist_ok=True)
    
    for role, idx in [('primary', '01'), ('hover', '02'), ('detail', '03')]:
        target_file = os.path.join(target_dir, f"{idx}-{role}.webp")
        
        # Check if we have an AI generated image
        ai_pattern = os.path.join(ai_images_dir, f"{id_str}_{role}_*.jpg")
        ai_files = glob.glob(ai_pattern)
        
        if ai_files:
            # We have AI image, convert to webp and save
            latest_file = sorted(ai_files)[-1]
            try:
                img = Image.open(latest_file)
                img.save(target_file, 'WEBP', quality=90)
                print(f"[{id_str} {role}] Saved AI image -> {target_file}")
            except Exception as e:
                print(f"Error converting AI image {latest_file}: {e}")
        else:
            # Generate placeholder
            img = generate_placeholder(slug, id_str, role, item[role])
            img.save(target_file, 'WEBP', quality=85)
            print(f"[{id_str} {role}] Generated placeholder -> {target_file}")

print("Phase 2 Image Generation Complete.")
