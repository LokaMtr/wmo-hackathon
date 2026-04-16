-- WMO Audit Database
-- Slaat alle beslissingen op voor accountability en herleidbaarheid

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    request_id VARCHAR(64) UNIQUE NOT NULL,
    token VARCHAR(128) NOT NULL,
    voorziening VARCHAR(100) NOT NULL,
    leeftijdsgroep VARCHAR(20),
    ernst VARCHAR(20),
    risico VARCHAR(20) NOT NULL,
    flags JSONB DEFAULT '[]'::jsonb,
    ai_voorstel TEXT,
    onderbouwing TEXT,
    besluit VARCHAR(20) NOT NULL,
    burger_bericht TEXT,
    reviewer_notes TEXT,
    raw_input JSONB
);

CREATE INDEX idx_audit_token ON audit_log(token);
CREATE INDEX idx_audit_created ON audit_log(created_at);
CREATE INDEX idx_audit_besluit ON audit_log(besluit);
CREATE INDEX idx_audit_risico ON audit_log(risico);

-- View voor reviewer dashboard
CREATE OR REPLACE VIEW review_queue AS
SELECT id, created_at, request_id, token, voorziening, ernst, risico, flags, ai_voorstel, onderbouwing
FROM audit_log
WHERE besluit = 'review'
ORDER BY created_at DESC;

-- View voor stats
CREATE OR REPLACE VIEW audit_stats AS
SELECT
    besluit,
    risico,
    COUNT(*) as aantal,
    DATE(created_at) as dag
FROM audit_log
GROUP BY besluit, risico, DATE(created_at)
ORDER BY dag DESC;
