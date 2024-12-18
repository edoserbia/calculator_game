from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.endpoints import secret, score
from backend.src.database import engine, Base

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Calculator API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(secret.router, prefix="/api", tags=["secrets"])
app.include_router(score.router, prefix="/api", tags=["scores"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Calculator API"} 