-- =============================================================================
-- AKIA Botanical Laboratory - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =============================================================================

-- 1. Enable UUID Extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    market_rate NUMERIC(10,2),
    weight TEXT NOT NULL,
    stock INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    badge TEXT,
    rating NUMERIC(3,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    inci TEXT,
    directions TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    delivery_instructions TEXT,
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_charge NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'new',
    payment_screenshot_url TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Business Settings Table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    business_name TEXT NOT NULL,
    business_phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    upi_id TEXT NOT NULL,
    upi_merchant_name TEXT NOT NULL,
    business_address TEXT NOT NULL,
    delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 50,
    free_shipping_threshold NUMERIC(10,2) NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Security Audit Logs Table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    event TEXT NOT NULL,
    username TEXT NOT NULL,
    ip_or_device TEXT,
    details TEXT
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES - SECURE LEAST-PRIVILEGE CONFIGURATION
-- (Idempotent: drops previous policy versions so this script can be re-run safely)
-- -----------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Categories
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
DROP POLICY IF EXISTS "Public all categories" ON public.categories;
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;

CREATE POLICY "Public read active categories" ON public.categories 
    FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage categories" ON public.categories 
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 2. Products
DROP POLICY IF EXISTS "Public read active products" ON public.products;
DROP POLICY IF EXISTS "Public all products" ON public.products;
DROP POLICY IF EXISTS "Admin manage products" ON public.products;

CREATE POLICY "Public read active products" ON public.products 
    FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage products" ON public.products 
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 3. Business Settings
DROP POLICY IF EXISTS "Public read settings" ON public.business_settings;
DROP POLICY IF EXISTS "Public read business settings" ON public.business_settings;
DROP POLICY IF EXISTS "Public read/write settings" ON public.business_settings;
DROP POLICY IF EXISTS "Admin update business settings" ON public.business_settings;

CREATE POLICY "Public read business settings" ON public.business_settings 
    FOR SELECT USING (true);
CREATE POLICY "Admin update business settings" ON public.business_settings 
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 4. Orders
DROP POLICY IF EXISTS "Public read/write orders" ON public.orders;
DROP POLICY IF EXISTS "Public customer place orders" ON public.orders;
DROP POLICY IF EXISTS "Admin view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;
DROP POLICY IF EXISTS "Admin delete orders" ON public.orders;

CREATE POLICY "Public customer place orders" ON public.orders 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view all orders" ON public.orders 
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage orders" ON public.orders 
    FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin delete orders" ON public.orders 
    FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Security Audit Logs
DROP POLICY IF EXISTS "Public read/write audit logs" ON public.security_audit_logs;
DROP POLICY IF EXISTS "Public append security audit logs" ON public.security_audit_logs;
DROP POLICY IF EXISTS "Admin view security audit logs" ON public.security_audit_logs;

CREATE POLICY "Public append security audit logs" ON public.security_audit_logs 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view security audit logs" ON public.security_audit_logs 
    FOR SELECT USING (auth.role() = 'authenticated');
-- (Notice: No UPDATE or DELETE policies are granted - audit logs are strictly append-only and tamper-proof)

-- -----------------------------------------------------------------------------
-- INITIAL SEED DATA: AKIA CATEGORIES & SETTINGS
-- -----------------------------------------------------------------------------
INSERT INTO public.business_settings (id, business_name, business_phone, whatsapp_number, upi_id, upi_merchant_name, business_address, delivery_charge, free_shipping_threshold)
VALUES (
    'default',
    'AKIA Hand Made & Herbal Care',
    '+91 8078462709',
    '918078462709',
    '8078462709@upi',
    'AKIA Hand Made',
    'AKIA Herbal & Hand Made Botanicals, Kerala, India (Contact: 8078462709 / 9497802709)',
    50,
    1000
)
ON CONFLICT (id) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    business_phone = EXCLUDED.business_phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    upi_id = EXCLUDED.upi_id,
    upi_merchant_name = EXCLUDED.upi_merchant_name,
    business_address = EXCLUDED.business_address,
    updated_at = NOW();

INSERT INTO public.categories (id, name, slug, description, image_url, is_active, display_order)
VALUES
    ('handmade-soaps', 'Handmade Soaps', 'handmade-soaps', 'AKIA Premium Hand Made Soaps — 100% Sulphate Free & Paraben Free artisan cold-process bars.', '/images/products/thulasi-soap.jpg', true, 1),
    ('facewash-cleansing', 'Facewash & Cleansing', 'facewash-cleansing', 'AKIA Home Made refreshing herbal face washes — Refreshing botanical care with Manjistha & Shankupushpam.', '/images/products/manjisthadi-facewash.jpg', true, 2),
    ('hair-care', 'Hair Care', 'hair-care', 'Traditional slow-macerated Brahmi Bhringaraj oil & anti-dandruff herbal shampoo.', '/images/products/bhringraj-hair-oil.jpg', true, 3),
    ('gels-nourishment', 'Gels & Hydration', 'gels-nourishment', 'Pure Aloevera Gel & Nalpamarathi Gel for sun-tan lightening, scar healing, and cellular hydration.', '/images/products/aloevera-gel.jpg', true, 4),
    ('creams-lip-care', 'Creams & Lip Care', 'creams-lip-care', 'AKIA Beauty Cream, Herbal Lip Balm, and soothing Ayurvedic Eye Kajal.', '/images/products/beauty-cream.jpg', true, 5)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    updated_at = NOW();

-- -----------------------------------------------------------------------------
-- INITIAL SEED DATA: 16 AKIA PRODUCTS FROM BROCHURE
-- -----------------------------------------------------------------------------
INSERT INTO public.products (id, name, category_id, category_name, description, price, market_rate, weight, stock, is_active, image_url, badge, rating, review_count, inci, directions, variants)
VALUES
    ('prod-thulasi-soap', 'Akia Thulasi Soap', 'handmade-soaps', 'Handmade Soaps', 'Cleanses pores deeply. Lead fighter of anti-acne club. Prevents early signs of ageing. Skin shines like a sunshine. A perfect moisturizer for skin. AKIA Premium Hand Made Soap — Sulphate Free | Paraben Free.', 60, 80, '100g', 50, true, '/images/products/thulasi-soap.jpg', 'Anti-Acne', 4.9, 148, 'Saponified Cocos Nucifera (Coconut) Oil, Ocimum Sanctum (Thulasi / Holy Basil) Leaf Extract, Castor Oil, Natural Vitamin E.', 'Work into a rich, creamy lather with water. Gently massage over face and body, then rinse thoroughly.', '[{"name":"Single Bar (100g)","price":60,"weight":"100g"},{"name":"Twin Pack (2 x 100g)","price":110,"weight":"200g"}]'::jsonb),
    ('prod-neem-soap', 'Akia Neem Soap', 'handmade-soaps', 'Handmade Soaps', 'Moisturizes the skin. Soothes inflamed and irritated skin. Fights multiple signs of premature aging. Tackles blackheads and whiteheads. Treats uneven skin tone. Fights acne and pimples. Protects against environmental damage.', 60, 80, '100g', 45, true, '/images/products/neem-soap.jpg', 'Blemish Defense', 4.9, 122, 'Azadirachta Indica (Neem) Seed Oil & Leaf Extract, Saponified Virgin Coconut Oil, Tea Tree Leaf Oil, Glycerin.', 'Apply to wet skin, massage lightly concentrating on breakout areas, rinse clean.', '[{"name":"Single Bar (100g)","price":60,"weight":"100g"},{"name":"Twin Pack (2 x 100g)","price":110,"weight":"200g"}]'::jsonb),
    ('prod-aloe-vera-soap', 'Akia Aloe-Vera Soap', 'handmade-soaps', 'Handmade Soaps', 'Using aloe vera soap on the skin can help moisturize skin and help manage skin conditions, such as acne. AKIA Premium Hand Made Soap with pure botanical freshness. Sulphate Free | Paraben Free.', 60, 80, '100g', 60, true, '/images/products/aloe-vera-soap.jpg', 'Hydrating', 4.8, 95, 'Pure Aloe Barbadensis Leaf Pulp, Saponified Coconut Oil, Olive Oil, Vegetable Glycerin.', 'Lather gently between wet palms and cleanse skin daily for deep cellular hydration.', '[{"name":"Single Bar (100g)","price":60,"weight":"100g"},{"name":"Twin Pack (2 x 100g)","price":110,"weight":"200g"}]'::jsonb),
    ('prod-manjisthadi-soap', 'Akia Manjisthadi Soap', 'handmade-soaps', 'Handmade Soaps', 'These help fight against harmful substances in your body and reduce redness or swelling. Manjistha also cleans your blood, which is good for skin health. Promotes even skin tone by reducing dark spots and blemishes.', 70, 90, '100g', 55, true, '/images/products/manjisthadi-soap.jpg', 'Radiant Complexion', 5.0, 167, 'Rubia Cordifolia (Manjistha) Root Decoction, Saponified Coconut & Sesame Oil, Vetiver Root Oil.', 'Glide velvety lather over skin, allow ayurvedic actives to work for 1 minute before rinsing.', '[{"name":"Single Bar (100g)","price":70,"weight":"100g"},{"name":"Twin Pack (2 x 100g)","price":130,"weight":"200g"}]'::jsonb),
    ('prod-red-sandal-soap', 'Akia Red Sandal Soap', 'handmade-soaps', 'Handmade Soaps', 'Provides relief from itchiness, redness, and skin discomfort. Oil Balancing: Red Sandalwood helps balance oil production in the skin. Helps control excess sebum secretion and prevent clogged pores.', 70, 90, '100g', 40, true, '/images/products/red-sandal-soap.jpg', 'Oil Balancing', 4.9, 135, 'Pterocarpus Santalinus (Red Sandalwood) Bark Extract, Sweet Almond Oil, Saponified Coconut Oil.', 'Lather over damp face and neck, leave for a moment to calm redness, rinse cleanly.', '[{"name":"Single Bar (100g)","price":70,"weight":"100g"},{"name":"Twin Pack (2 x 100g)","price":130,"weight":"200g"}]'::jsonb),
    ('prod-charcoal-soap', 'Akia Charcoal Soap', 'handmade-soaps', 'Handmade Soaps', 'Deeply cleans skin by trapping dirt, oil, and impurities like a magnet. It helps control excess grease, reduces blackheads, clears acne breakouts, and minimizes the look of pores.', 75, 95, '100g', 50, true, '/images/products/charcoal-soap.jpg', 'Deep Detox', 4.9, 110, 'Activated Bamboo Charcoal, Saponified Virgin Coconut Oil, Tea Tree Leaf Oil, Olive Oil.', 'Form lather and massage onto face or body, focusing on T-zone and pores. Rinse thoroughly.', '[{"name":"Single Bar (100g)","price":75,"weight":"100g"},{"name":"Twin Pack (2 x 100g)","price":140,"weight":"200g"}]'::jsonb),
    ('prod-goat-milk-soap', 'Akia Goat Milk Soap', 'handmade-soaps', 'Handmade Soaps', 'Hydrates dry skin, calms irritation from conditions like eczema and psoriasis, provides mild natural exfoliation, and cleanses the skin without stripping away essential moisture.', 85, 110, '100g', 35, true, '/images/products/goat-milk-soap.jpg', 'Sensitive Skin', 5.0, 98, 'Caprae Lac (Fresh Whole Goat Milk), Saponified Olea Europaea Oil, Coconut Oil, Shea Butter.', 'Gentle enough for the most delicate skin. Use daily in warm water.', '[{"name":"Single Bar (100g)","price":85,"weight":"100g"},{"name":"Twin Pack (2 x 100g)","price":160,"weight":"200g"}]'::jsonb),
    ('prod-bhringraj-hair-oil', 'Akia Brahmi Bhringaraj Hair Oil', 'hair-care', 'Hair Care', 'Reduces hair fall. Nourishes growth of baby hair, reduces dandruff. Provides good sleep and prevents premature greying. Traditional slow herbal maceration with pure Brahmi and Bhringraj.', 150, 195, '100 ml', 65, true, '/images/products/bhringraj-hair-oil.jpg', 'Hair Fall Defense', 5.0, 214, 'Brahmi (Bacopa Monnieri), Bhringraj (Eclipta Alba), Cold-Pressed Coconut Oil, Amla, Curry Leaf, Fenugreek.', 'Gently massage into scalp with fingertips before bedtime or 1 hour prior to washing.', '[{"name":"100 ml Flacon","price":150,"weight":"100 ml"},{"name":"200 ml Bottle (+₹130)","price":280,"weight":"200 ml"}]'::jsonb),
    ('prod-aloevera-gel', 'Akia Aloevera Gel', 'gels-nourishment', 'Gels & Hydration', 'It is lightweight, non-greasy, and rapid hydration, making them ideal for oily, combination, or acne-prone skin. Their water-based formula soothes, cools, and reduces inflammation.', 110, 150, '100g', 50, true, '/images/products/aloevera-gel.jpg', 'Soothing Relief', 4.8, 104, 'Pure Aloe Barbadensis Leaf Inner Fillet Gel, Plant-Derived Cellulose, Natural Vitamin E.', 'Smooth a dime-sized amount over freshly cleansed skin morning and evening.', '[{"name":"100g Jar","price":110,"weight":"100g"}]'::jsonb),
    ('prod-nalpamarathi-gel', 'Akia Nalpamarathi Gel', 'gels-nourishment', 'Gels & Hydration', 'Lighten sun tans, brighten skin complexion, reduce dark spots, soothe acne scars, and hydrate the skin without the heavy greasiness of traditional oils.', 140, 190, '100g', 40, true, '/images/products/nalpamarathi-gel.jpg', 'Tan Removal', 4.9, 88, 'Nalpamara Quadrilateral Bark Extract, Turmeric Hydrosol, Natural Gelling Matrix, Vetiver Oil.', 'Apply evenly on face and exposed areas. Leave on or massage until completely absorbed.', '[{"name":"100g Jar","price":140,"weight":"100g"}]'::jsonb),
    ('prod-manjisthadi-facewash', 'Akia Manjisthadi Face Wash', 'facewash-cleansing', 'Facewash & Cleansing', 'Manjistha is highly effective at removing tan, reducing pigmentation, and brightening skin tone naturally. AKIA Home Made herbal face wash with gentle, refreshing lather.', 180, 220, '100 ml', 50, true, '/images/products/manjisthadi-facewash.jpg', 'Skin Brightening', 4.9, 142, 'Manjistha (Rubia Cordifolia) Decoction, Saffron Water, Decyl Glucoside, Rose Floral Hydrosol.', 'Pump small amount into hands, lather with water, wash face in upward circular strokes and rinse.', '[{"name":"100 ml Bottle","price":180,"weight":"100 ml"}]'::jsonb),
    ('prod-shankupushpam-facewash', 'Akia Shankupushpam Face Wash', 'facewash-cleansing', 'Facewash & Cleansing', 'Deeply cleanses, hydrates, and rejuvenates the skin by removing excess oil and dead cells. AKIA Home Made herbal face wash enriched with natural butterfly pea botanical actives.', 190, 240, '100 ml', 35, true, '/images/products/shankupushpam-facewash.jpg', 'Rejuvenating', 5.0, 76, 'Clitoria Ternatea (Shankupushpam) Blossom Extract, Vegetable Glycerin, Coco Glucoside, Pro-Vitamin B5.', 'Dispense a coin size onto wet skin. Wash face and rinse with cool water.', '[{"name":"100 ml Bottle","price":190,"weight":"100 ml"}]'::jsonb),
    ('prod-beauty-cream', 'Akia Premium Beauty Cream', 'creams-lip-care', 'Creams & Lip Care', 'Maintaining a healthy, radiant complexion by providing a combination of hydration, barrier protection, and targeted treatment. AKIA Premium Home Made Beauty Cream.', 190, 260, '100g', 45, true, '/images/products/beauty-cream.jpg', 'Barrier Protection', 4.9, 188, 'Whipped Pure Kokum Butter, Sweet Almond Oil, Saffron Stigma Infusion, Raw Beeswax, Vitamin E.', 'Take a small pearl of cream and massage gently over clean face and neck every evening.', '[{"name":"100 GM Tub","price":190,"weight":"100g"}]'::jsonb),
    ('prod-lip-balm', 'Akia Herbal Lip Balm', 'creams-lip-care', 'Creams & Lip Care', 'Lip balm can help prevent dry, chapped lips from bleeding and flaking. Lips don''t have oil glands, so they need help from outside sources to stay hydrated.', 90, 120, '10g', 55, true, '/images/products/lip-balm.jpg', 'Intense Hydration', 4.8, 92, 'Organic Beeswax, Raw Cocoa Butter, Virgin Coconut Oil, Natural Vitamin E.', 'Glide directly over dry lips as often as needed throughout the day.', '[{"name":"10g Tub","price":90,"weight":"10g"}]'::jsonb),
    ('prod-eye-kajal', 'Akia Eye Kajal', 'creams-lip-care', 'Creams & Lip Care', 'Used to soothe tired eyes, cool the eye area, reduce dryness, and sometimes promote healthier, darker lashes. Traditional herbal eye kajal prepared with pure cow ghee and camphor.', 120, 160, '1 pc', 40, true, '/images/products/eye-kajal.jpg', 'Cooling Kajal', 5.0, 115, 'Medicinal Castor Oil Lamp Soot, Desi Cow Ghee, Bhimseni Camphor, Pure Almond Oil.', 'Apply along water line with clean fingertips or applicator for cooling depth and clarity.', '[{"name":"Handcrafted Glass Pot","price":120,"weight":"1 pc"}]'::jsonb),
    ('prod-herbal-shampoo', 'Akia Herbal Shampoo', 'hair-care', 'Hair Care', 'Used as an Anti Dandruff Shampoo is packed with natural antifungal agents that reduce dandruff, flaking & soothe itchy scalp. AKIA Home Made herbal formulation.', 180, 230, '100 ml', 45, true, '/images/products/herbal-shampoo.jpg', 'Anti-Dandruff', 4.9, 130, 'Acacia Concinna (Shikakai), Sapindus (Reetha), Hibiscus Leaf Decoction, Neem, Aloe Vera.', 'Massage onto wet hair and scalp, work into herbal lather, let sit for 2 minutes, then rinse.', '[{"name":"100 ml Bottle","price":180,"weight":"100 ml"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    category_name = EXCLUDED.category_name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    market_rate = EXCLUDED.market_rate,
    weight = EXCLUDED.weight,
    image_url = EXCLUDED.image_url,
    badge = EXCLUDED.badge,
    inci = EXCLUDED.inci,
    directions = EXCLUDED.directions,
    variants = EXCLUDED.variants,
    updated_at = NOW();

-- -----------------------------------------------------------------------------
-- 7. SUPABASE STORAGE BUCKET: product-images
-- -----------------------------------------------------------------------------
-- Creates public bucket for product & category photos uploaded via Admin Dashboard.
-- Images uploaded here are served by Supabase's global CDN to every website visitor.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    10485760, -- 10MB limit per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

-- Storage Row-Level Security (RLS) Policies
DO $$
BEGIN
    -- Public read access so any visitor's browser can load product images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to product-images'
    ) THEN
        CREATE POLICY "Public Access to product-images" ON storage.objects
            FOR SELECT USING (bucket_id = 'product-images');
    END IF;

    -- Public upload access for Admin Dashboard image uploads
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Upload to product-images'
    ) THEN
        CREATE POLICY "Public Upload to product-images" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'product-images');
    END IF;

    -- Public update access for re-uploading / replacing product images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Modify in product-images'
    ) THEN
        CREATE POLICY "Public Modify in product-images" ON storage.objects
            FOR UPDATE USING (bucket_id = 'product-images');
    END IF;

    -- Public delete access for removing deprecated product images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Delete in product-images'
    ) THEN
        CREATE POLICY "Public Delete in product-images" ON storage.objects
            FOR DELETE USING (bucket_id = 'product-images');
    END IF;
END
$$;

