from datetime import date, timedelta
from uuid import uuid4


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:8]}"


dishes: dict[str, dict] = {
    "dish_beef": {
        "id": "dish_beef",
        "name": "鲜切肥牛",
        "category": "肉类",
        "flavor": "原味",
        "status": "active",
        "description": "精选肥牛卷，适合番茄锅和麻辣锅。",
    },
    "dish_tripe": {
        "id": "dish_tripe",
        "name": "脆毛肚",
        "category": "肉类",
        "flavor": "爽脆",
        "status": "active",
        "description": "七上八下经典菜品，门店高频点单。",
    },
    "dish_mushroom": {
        "id": "dish_mushroom",
        "name": "菌菇拼盘",
        "category": "素菜",
        "flavor": "清鲜",
        "status": "seasonal",
        "description": "香菇、金针菇、蟹味菇组合。",
    },
}

specifications: dict[str, dict] = {
    "spec_beef_small": {
        "id": "spec_beef_small",
        "dish_id": "dish_beef",
        "name": "小份",
        "serving_size": "180g",
        "sale_price": 38,
        "ingredient_cost": 18.5,
        "packaging_cost": 1.2,
    },
    "spec_beef_large": {
        "id": "spec_beef_large",
        "dish_id": "dish_beef",
        "name": "大份",
        "serving_size": "300g",
        "sale_price": 58,
        "ingredient_cost": 29.8,
        "packaging_cost": 1.6,
    },
    "spec_tripe_regular": {
        "id": "spec_tripe_regular",
        "dish_id": "dish_tripe",
        "name": "标准份",
        "serving_size": "220g",
        "sale_price": 46,
        "ingredient_cost": 20.4,
        "packaging_cost": 1.4,
    },
    "spec_mushroom_regular": {
        "id": "spec_mushroom_regular",
        "dish_id": "dish_mushroom",
        "name": "标准份",
        "serving_size": "260g",
        "sale_price": 28,
        "ingredient_cost": 11.6,
        "packaging_cost": 1.0,
    },
}

ingredients: dict[str, dict] = {
    "ing_beef": {
        "id": "ing_beef",
        "name": "肥牛原料",
        "category": "冻品",
        "stock_qty": 48,
        "unit": "kg",
        "safety_stock": 35,
        "avg_price": 86,
    },
    "ing_tripe": {
        "id": "ing_tripe",
        "name": "毛肚",
        "category": "鲜品",
        "stock_qty": 18,
        "unit": "kg",
        "safety_stock": 22,
        "avg_price": 92,
    },
    "ing_mushroom": {
        "id": "ing_mushroom",
        "name": "混合菌菇",
        "category": "蔬菜",
        "stock_qty": 32,
        "unit": "kg",
        "safety_stock": 25,
        "avg_price": 18,
    },
    "ing_packaging": {
        "id": "ing_packaging",
        "name": "外卖餐盒",
        "category": "耗材",
        "stock_qty": 520,
        "unit": "套",
        "safety_stock": 400,
        "avg_price": 1.1,
    },
}

suppliers: dict[str, dict] = {
    "sup_fresh": {
        "id": "sup_fresh",
        "name": "蜀味鲜配",
        "contact": "李经理 13800001111",
        "rating": 4.7,
    },
    "sup_cold": {
        "id": "sup_cold",
        "name": "北方冷链",
        "contact": "王经理 13900002222",
        "rating": 4.5,
    },
}

purchase_orders: dict[str, dict] = {
    "po_tripe": {
        "id": "po_tripe",
        "supplier_id": "sup_fresh",
        "expected_arrival": date.today() + timedelta(days=2),
        "items": [{"ingredient_id": "ing_tripe", "qty": 12, "unit_price": 90}],
        "remark": "补足周末库存",
        "status": "ordered",
        "total_amount": 1080,
    }
}

