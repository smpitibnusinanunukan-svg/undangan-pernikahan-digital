-- =========================================================
-- SKEMA SUPABASE (POSTGRESQL) UNTUK UNDANGAN PERNIKAHAN
-- =========================================================

-- 1. Buat tipe data khusus untuk status kehadiran
CREATE TYPE attend_status AS ENUM ('hadir', 'tidak_hadir', 'mungkin');

-- =========================================================
-- TABEL 1: WISHES (UCAPAN & RSVP)
-- Menyimpan data tamu yang mengisi formulir konfirmasi kehadiran.
-- =========================================================
CREATE TABLE public.wishes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name text NOT NULL,
    attend attend_status NOT NULL DEFAULT 'mungkin',
    message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- TABEL 2: WEDDING CONFIG (PENGATURAN WEBSITE)
-- Menyantikan config.js. Semua warna, foto, teks, dan background
-- tersimpan di sini sehingga Admin bisa mengedit langsung tanpa push kode baru.
-- =========================================================
CREATE TABLE public.wedding_config (
    id smallint PRIMARY KEY DEFAULT 1,
    texts jsonb DEFAULT '{}'::jsonb,
    colors jsonb DEFAULT '{}'::jsonb,
    images jsonb DEFAULT '{}'::jsonb,
    bg_main jsonb DEFAULT '{}'::jsonb,
    bg_opening jsonb DEFAULT '{}'::jsonb,
    music jsonb DEFAULT '{}'::jsonb,
    maps jsonb DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row_config CHECK (id = 1) -- Memastikan hanya ada 1 baris
);

-- Inisialisasi baris pertama yang kosong
INSERT INTO public.wedding_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- =========================================================
-- TABEL 3: GUEST LIST (DAFTAR KONTAK WHATSAPP)
-- Menyimpan kontak yang akan/sudah dikirimi pesan WA dari Admin.
-- =========================================================
CREATE TABLE public.guest_list (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    is_sent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) - KEAMANAN DATABASE
-- =========================================================
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_list ENABLE ROW LEVEL SECURITY;

-- Aturan WISHES (Semua orang boleh melihat dan mengirim ucapan)
CREATE POLICY "Public can view wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Public can insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);

-- Aturan CONFIG (Semua orang boleh melihat, TAPI HANYA Admin yang boleh Update)
CREATE POLICY "Public can view config" ON public.wedding_config FOR SELECT USING (true);
CREATE POLICY "Admin can update config" ON public.wedding_config FOR UPDATE USING (auth.role() = 'authenticated');

-- Aturan GUEST LIST (Hanya Admin yang boleh melihat dan menambah daftar)
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
