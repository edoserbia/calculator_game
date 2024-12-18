# 计算器应用后端设计文档

## 技术栈

- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- uvicorn

## 目录结构

```
backend/
├── src/
│   ├── models/           # 数据模型
│   │   ├── secret.py     # 秘籍模型
│   │   └── score.py      # 游戏分数模型
│   ├── schemas/          # Pydantic模式
│   │   ├── secret.py     # 秘籍验证模式
│   │   └── score.py      # 分数提交模式
│   └── database.py       # 数据库配置
├── api/
│   ├── endpoints/        # API端点
│   │   ├── secret.py     # 秘籍相关接口
│   │   └── score.py      # 分数相关接口
│   └── deps.py          # 依赖注入
├── tests/               # 测试文件
├── alembic/             # 数据库迁移
├── requirements.txt     # 项目依赖
└── main.py             # 应用入口
```

## API接口设计

### 1. 秘籍验证接口

```python
# POST /api/verify-secret
Request:
{
    "code": "string"  # 用户输入的秘籍
}

Response:
{
    "valid": boolean,
    "game_type": string  # 如果验证成功，返回游戏类型
}
```

### 2. 秘籍管理接口

```python
# GET /api/secrets
Response:
[
    {
        "id": int,
        "code": string,
        "game_type": string,
        "active": boolean
    }
]

# POST /api/secrets
Request:
{
    "code": string,
    "game_type": string,
    "active": boolean
}

# PUT /api/secrets/{secret_id}
Request:
{
    "code": string,
    "game_type": string,
    "active": boolean
}

# DELETE /api/secrets/{secret_id}
```

### 3. 游戏分数接口

```python
# POST /api/scores
Request:
{
    "score": int,
    "player_name": string
}

# GET /api/scores/top
Response:
[
    {
        "player_name": string,
        "score": int,
        "date": datetime
    }
]
```

## 数据库设计

### 1. secrets表
- id: 主键
- code: 秘籍代码
- game_type: 游戏类型
- active: 是否激活
- created_at: 创建时间
- updated_at: 更新时间

### 2. scores表
- id: 主键
- player_name: 玩家名称
- score: 分数
- game_type: 游戏类型
- created_at: 创建时间

## 开发指南

1. 环境配置
```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt
```

2. 启动服务器
```bash
uvicorn main:app --reload
```

3. 数据库迁移
```bash
# 初始化alembic
alembic init alembic

# 创建迁移
alembic revision --autogenerate -m "description"

# 执行迁移
alembic upgrade head
```

## 性能优化

1. 数据库优化
   - 使用适当的索引
   - 实现缓存机制
   - 优化查询语句

2. API优化
   - 实现请求限流
   - 添加响应缓存
   - 异步处理长时间任务

## 安全措施

1. 输入验证
   - 使用Pydantic模型验证
   - 实现请求大小限制
   - SQL注入防护

2. 认证授权
   - API密钥验证
   - CORS配置
   - 请求频率限制

## 测试

1. 单元测试
   - API端点测试
   - 数据模型测试
   - 业务逻辑测试

2. 集成测试
   - 数据库集成测试
   - API集成测试

3. 性能测试
   - 负载测试
   - 压力测试