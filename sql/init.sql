-- 删除已存在的数据库和用户（如果存在）
DROP DATABASE IF EXISTS calculator;
DROP USER IF EXISTS calculator_app;
DROP USER IF EXISTS calculator_readonly;

-- 创建数据库
CREATE DATABASE calculator
    WITH 
    TEMPLATE template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'Chinese (Simplified)_China.936'
    LC_CTYPE = 'Chinese (Simplified)_China.936';

-- 创建应用用户
CREATE USER calculator_app WITH PASSWORD 'calc123456';
CREATE USER calculator_readonly WITH PASSWORD 'readonly123456';

-- 授予数据库连接权限
GRANT CONNECT ON DATABASE calculator TO postgres;
GRANT CONNECT ON DATABASE calculator TO calculator_app;
GRANT CONNECT ON DATABASE calculator TO calculator_readonly;

-- 切换到calculator数据库
\c calculator;

-- 创建表
CREATE TABLE secrets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    game_type VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_secrets_code ON secrets(code);
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_game_type ON scores(game_type);

-- 授予schema权限
GRANT USAGE ON SCHEMA public TO calculator_app;
GRANT USAGE ON SCHEMA public TO calculator_readonly;

-- 授予表权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO calculator_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO calculator_app;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO calculator_readonly;

-- 设置默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON TABLES TO calculator_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON SEQUENCES TO calculator_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT ON TABLES TO calculator_readonly;

-- 插入初始数据
INSERT INTO secrets (code, game_type) VALUES ('9527*9527-9527=', 'snake');

-- 将数据库所有权授予postgres用户
ALTER DATABASE calculator OWNER TO postgres;