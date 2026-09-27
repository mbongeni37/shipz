CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), full_name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 whatsapp TEXT NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'student' CHECK(role IN('student','admin')),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN('pending','active','blocked','rejected')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_login_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS modules (
 id INTEGER PRIMARY KEY, title TEXT NOT NULL, price_usd NUMERIC(10,2) NOT NULL DEFAULT 12,
 is_free BOOLEAN NOT NULL DEFAULT FALSE, description TEXT NOT NULL, sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS lessons (
 id SERIAL PRIMARY KEY, module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
 title TEXT NOT NULL, body_html TEXT NOT NULL, sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS module_pages (
 id SERIAL PRIMARY KEY, module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
 page_no INTEGER NOT NULL, title TEXT NOT NULL, body_html TEXT NOT NULL,
 page_type TEXT NOT NULL DEFAULT 'lesson' CHECK(page_type IN('lesson','exam')),
 UNIQUE(module_id,page_no)
);
CREATE TABLE IF NOT EXISTS exam_questions (
 id SERIAL PRIMARY KEY, module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
 exam_no INTEGER NOT NULL CHECK(exam_no IN(1,2)), question_no INTEGER NOT NULL,
 question TEXT NOT NULL, option_a TEXT NOT NULL, option_b TEXT NOT NULL, option_c TEXT NOT NULL, option_d TEXT NOT NULL,
 correct_option CHAR(1) NOT NULL CHECK(correct_option IN('A','B','C','D')),
 UNIQUE(module_id,exam_no,question_no)
);
CREATE TABLE IF NOT EXISTS exam_attempts (
 id SERIAL PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE, exam_no INTEGER NOT NULL CHECK(exam_no IN(1,2)),
 score INTEGER NOT NULL, total INTEGER NOT NULL, passed BOOLEAN NOT NULL, answers JSONB,
 attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS student_progress (
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
 exam_no INTEGER NOT NULL CHECK(exam_no IN(1,2)), score INTEGER NOT NULL, passed BOOLEAN NOT NULL,
 completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(user_id,module_id,exam_no)
);
CREATE TABLE IF NOT EXISTS module_access (
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
 granted_by UUID REFERENCES users(id) ON DELETE SET NULL, payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK(payment_status IN('not_required','pending','verified','rejected')),
 payment_reference TEXT, granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(user_id,module_id)
);
CREATE TABLE IF NOT EXISTS payment_requests (
 id SERIAL PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
 amount_usd NUMERIC(10,2) NOT NULL DEFAULT 12, method TEXT NOT NULL DEFAULT 'Bank Transfer', reference TEXT, proof_note TEXT,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN('pending','verified','rejected')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 reviewed_at TIMESTAMPTZ, reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS audit_log (
 id BIGSERIAL PRIMARY KEY, admin_id UUID REFERENCES users(id) ON DELETE SET NULL, action TEXT NOT NULL,
 target_user_id UUID REFERENCES users(id) ON DELETE SET NULL, module_id INTEGER REFERENCES modules(id) ON DELETE SET NULL,
 details JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Existing installations: registration is automatic for students.
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'active';
UPDATE users SET status='active' WHERE role='student' AND status='pending';
