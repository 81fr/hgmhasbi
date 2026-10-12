-- Knowledge Base files and URLs
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'document', 'url', 'system_data'
    source VARCHAR(500) NOT NULL, -- url or filename
    content TEXT, -- Extracted text or summary
    status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'active', 'error'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- FAQ Table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for demo)
CREATE POLICY "Allow all actions for authenticated users on kb" ON knowledge_base FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users on faqs" ON faqs FOR ALL USING (true);
