# 计算器应用数据库设计文档

## 数据库信息

- 数据库类型：PostgreSQL 17
- 字符集：UTF-8
- 排序规则：en_US.UTF-8

## 数据库架构

### 1. 数据库表

#### secrets表（秘籍表）
```sql
CREATE TABLE secrets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    game_type VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_secrets_code ON secrets(code);
```

#### scores表（游戏分数表）
```sql
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_game_type ON scores(game_type);
```

### 2. 初始数据

```sql
-- 插入默认秘籍
INSERT INTO secrets (code, game_type) 
VALUES ('9527*9527-9527=', 'snake');
```

## 数据库权限

### 1. 应用用户权限
```sql
-- 创建应用用户
CREATE USER calculator_app WITH PASSWORD 'your_password';

-- 授予权限
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO calculator_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO calculator_app;
```

### 2. 只读用户权限
```sql
-- 创建只读用户
CREATE USER calculator_readonly WITH PASSWORD 'readonly_password';

-- 授予只读权限
GRANT SELECT ON ALL TABLES IN SCHEMA public TO calculator_readonly;
```

## 备份策略

1. 定时备份
```bash
# 每日完整备份
pg_dump -U postgres calculator > backup_$(date +%Y%m%d).sql

# 保留最近30天的备份
find /backup -name "backup_*.sql" -mtime +30 -delete
```

2. 备份脚本
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backup"
DATE=$(date +%Y%m%d)
pg_dump -U postgres calculator > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql
```

## 维护计划

### 1. 定期维护任务
```sql
-- 清理过期数据
DELETE FROM scores WHERE created_at < NOW() - INTERVAL '1 year';

-- 更新统计信息
ANALYZE secrets;
ANALYZE scores;
```

### 2. 索引维护
```sql
-- 重建索引
REINDEX TABLE secrets;
REINDEX TABLE scores;
```

## 监控方案

1. 性能监控
   - 查询执行时间
   - 连接数
   - 缓存命中率
   - 磁盘使用情况

2. 告警设置
   - 磁盘空间不足告警
   - 长时间运行查询告警
   - 连接数超限告警

## 部署说明

1. 初始化数据库
```bash
# 创建数据库
createdb -U postgres calculator

# 执行初始化脚本
psql -U postgres -d calculator -f init.sql
```

2. 配置连接
```bash
# 配置pg_hba.conf允许应用连接
host    calculator    calculator_app    0.0.0.0/0    md5
```

3. 性能优化配置
```ini
# postgresql.conf 优化参数
max_connections = 100
shared_buffers = 256MB
work_mem = 4MB
maintenance_work_mem = 64MB
effective_cache_size = 768MB
```

## 故障恢复

1. 数据恢复
```bash
# 从备份恢复
psql -U postgres calculator < backup_20240101.sql
```

2. 紧急维护
```sql
-- 终止长时间运行的查询
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active' 
AND query_start < now() - interval '1 hour';
```