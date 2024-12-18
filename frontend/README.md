# 计算器应用前端设计文档

## 技术栈

- React Native
- React Navigation
- React Native Elements
- Expo

## 目录结构

```
frontend/
├── src/                # 源代码目录
│   ├── screens/       # 页面组件
│   │   ├── Calculator.js        # 基础计算器
│   │   ├── ScientificCalc.js    # 科学计算器
│   │   └── SnakeGame.js         # 贪吃蛇游戏
│   ├── components/    # 可复用组件
│   │   ├── CalcButton.js        # 计算器按钮
│   │   ├── CalcDisplay.js       # 计算器显示屏
│   │   └── GameCanvas.js        # 游戏画布
│   ├── utils/         # 工具函数
│   │   ├── calculations.js      # 计算逻辑
│   │   └── secretCode.js        # 秘籍检测
│   ├── api/           # API调用
│   │   └── index.js             # API接口
│   └── App.js         # 应用入口
└── package.json       # 项目依赖
```

## 功能模块

### 1. 基础计算器
- 支持加减乘除基础运算
- 支持清除、退格功能
- 支持小数点运算
- 支持正负号切换

### 2. 科学计算器
- 支持三角函数（sin、cos、tan）
- 支持对数运算（ln、log）
- 支持指数运算
- 支持括号运算
- 支持常数π和e

### 3. 贪吃蛇游戏
- 通过秘籍触发（默认：9527*9527-9527=）
- 支持触摸控制
- 支持计分系统
- 支持游戏暂停/继续

## 界面设计

1. 计算器界面
   - 采用网格布局
   - 深色主题
   - 响应式设计
   - 按钮点击动画效果

2. 游戏界面
   - 全屏画布
   - 简约设计
   - 清晰的得分显示
   - 游戏控制按钮

## 开发指南

1. 环境配置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

2. 构建应用
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## API集成

1. 秘籍验证
```javascript
// 向后端发送秘籍验证请求
POST /api/verify-secret
{
    "code": "9527*9527-9527="
}
```

2. 游戏分数提交
```javascript
// 提交游戏分数
POST /api/submit-score
{
    "score": 100
}
```

## 注意事项

1. 跨平台兼容性
   - 确保所有组件在不同平台表现一致
   - 使用平台特定的样式适配

2. 性能优化
   - 使用React.memo优化组件重渲染
   - 避免不必要的状态更新
   - 优化游戏渲染性能

3. 测试
   - 编写单元测试
   - 进行跨平台测试
   - 性能测试