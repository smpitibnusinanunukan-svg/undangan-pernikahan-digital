-- =========================================================
-- SKEMA SUPABASE (POSTGRESQL) UNTUK UNDANGAN PERNIKAHAN
-- =========================================================

-- 1. Buat tipe data khusus untuk status kehadiran (jika belum ada)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attend_status') THEN
        CREATE TYPE attend_status AS ENUM ('hadir', 'tidak_hadir', 'mungkin');
    END IF;
END$$;

-- =========================================================
-- TABEL 1: WISHES (UCAPAN & RSVP)
-- =========================================================
-- TABEL 1: WISHES (UCAPAN & RSVP)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.wishes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name text NOT NULL,
    attend attend_status NOT NULL DEFAULT 'mungkin',
    message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- TABEL 2: WEDDING CONFIG (PENGATURAN WEBSITE)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.wedding_config (
    id smallint PRIMARY KEY DEFAULT 1,
    texts jsonb DEFAULT '{}'::jsonb,
    colors jsonb DEFAULT '{}'::jsonb,
    images jsonb DEFAULT '{}'::jsonb,
    bg_main jsonb DEFAULT '{}'::jsonb,
    bg_opening jsonb DEFAULT '{}'::jsonb,
    music jsonb DEFAULT '{}'::jsonb,
    maps jsonb DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row_config CHECK (id = 1)
);

-- Memastikan kolom 'extra' ditambahkan meskipun tabel sudah terlanjur dibuat di masa lalu
ALTER TABLE public.wedding_config ADD COLUMN IF NOT EXISTS extra jsonb DEFAULT '{}'::jsonb;

-- Inisialisasi baris pertama yang kosong
INSERT INTO public.wedding_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- =========================================================
-- TABEL 3: GUEST LIST (DAFTAR KONTAK WHATSAPP)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.guest_list (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    is_sent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- STORAGE BUCKETS (FILE UNGGAHAN: MUSIK, PARTIKEL KUSTOM)
-- =========================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-assets', 'wedding-assets', true) ON CONFLICT DO NOTHING;
-- Policy checking is tricky to make idempotent via raw sql without drop, so we drop first
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Public or Auth upload" ON storage.objects;
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-assets');
CREATE POLICY "Public or Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wedding-assets');

-- =========================================================
-- ROW LEVEL SECURITY (RLS) - KEAMANAN DATABASE
-- =========================================================
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_list ENABLE ROW LEVEL SECURITY;

-- Aturan WISHES (Semua orang boleh melihat dan mengirim ucapan)
DROP POLICY IF EXISTS "Public can view wishes" ON public.wishes;
DROP POLICY IF EXISTS "Public can insert wishes" ON public.wishes;
CREATE POLICY "Public can view wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Public can insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);

-- Aturan CONFIG (Hak Bebas: Karena fitur login Vercel terkendala auth, policy diubah menjadi ALL/anon)
DROP POLICY IF EXISTS "Public can view config" ON public.wedding_config;
DROP POLICY IF EXISTS "Admin can update config" ON public.wedding_config;
DROP POLICY IF EXISTS "Allow all with anon key" ON public.wedding_config;
CREATE POLICY "Allow all with anon key" ON public.wedding_config FOR ALL USING (true) WITH CHECK (true);

-- Aturan GUEST LIST (Hanya Admin yang boleh melihat dan menambah daftar)
DROP POLICY IF EXISTS "Admin full access to guest list" ON public.guest_list;
CREATE POLICY "Admin full access to guest list" ON public.guest_list USING (auth.role() = 'authenticated');


-- ============================================================== 
-- SCRIPT MEMBUAT AKUN ADMIN LANGSUNG JADI (TANPA VERIFIKASI EMAIL) 
-- ============================================================== 
INSERT INTO auth.users ( 
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at 
) VALUES ( 
  '00000000-0000-0000-0000-000000000000', 
  gen_random_uuid(), 
  'authenticated', 
  'authenticated', 
  'undangan@one.com', 
  crypt('istiqomah', gen_salt('bf')), 
  current_timestamp, 
  '{"provider":"email","providers":["email"]}', 
  '{}', 
  current_timestamp, 
  current_timestamp 
);
