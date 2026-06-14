# 火锅店菜品管理系统

FastAPI + React 实现的火锅店菜品管理系统，覆盖菜品库维护、规格设置、供应链采购、成本利润核算和经营看板。项目按前后端模块化拆分，便于后续接入数据库、登录权限和门店多租户。

## 功能模块

- 菜品库维护：新增菜品、上下架、删除菜品，维护分类、风味和描述。
- 规格设置：为菜品配置小份/大份/标准份等规格，维护售价、原料成本、包装损耗成本，并自动计算毛利和毛利率。
- 供应链采购：查看原料库存和安全库存，新建采购单，采购入库后自动增加库存并更新均价。
- 成本利润核算：按规格汇总售价、成本、毛利、毛利率。
- 经营看板：展示在售菜品、低库存原料、待处理采购、平均毛利率和库存估值。

## 目录结构

```text
.
├── backend
│   ├── app
│   │   ├── api/routes        # FastAPI 路由
│   │   ├── core              # 配置
│   │   ├── data              # 内存数据与种子数据
│   │   ├── schemas           # Pydantic 模型
│   │   ├── services          # 业务服务
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── api               # API 客户端
│   │   ├── components        # 通用组件
│   │   ├── pages             # 模块页面
│   │   ├── App.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Docker 启动

```bash
docker compose up --build
```

访问地址：

- 前端：http://127.0.0.1:15173
- 后端健康检查：http://127.0.0.1:18000/health
- API 文档：http://127.0.0.1:18000/docs

Docker 启动时后端容器内部端口为 `8000`，映射到宿主机 `18000`；前端容器内部端口为 `5173`，映射到宿主机 `15173`，避免和本机常见开发服务冲突。

## 本地开发

后端：

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

前端：

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

如需指定 API 地址，可设置：

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 主要接口

- `GET /api/summary`：经营汇总。
- `GET/POST /api/dishes`：菜品列表与新增。
- `PUT/DELETE /api/dishes/{dish_id}`：更新与删除菜品。
- `GET/POST /api/specifications`：规格列表与新增。
- `GET /api/ingredients`：原料库存。
- `GET /api/suppliers`：供应商。
- `GET/POST /api/purchase-orders`：采购单列表与新增。
- `PATCH /api/purchase-orders/{order_id}/status`：更新采购状态，入库时同步库存。
- `GET /api/finance/profit-report`：成本利润报表。

## 说明

当前版本使用内存数据存储，重启服务后数据会恢复到种子数据。生产化时建议增加 PostgreSQL/MySQL、Alembic 迁移、用户权限、审计日志和采购审批流。
