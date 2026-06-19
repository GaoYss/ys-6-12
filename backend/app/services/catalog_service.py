from datetime import datetime
from fastapi import HTTPException, status

from app.data import store
from app.schemas.dishes import DishCreate, DishUpdate, SpecificationCreate, SpecificationUpdate


def _spec_with_profit(spec: dict) -> dict:
    cost = spec["ingredient_cost"] + spec["packaging_cost"]
    gross_profit = round(spec["sale_price"] - cost, 2)
    gross_margin = round(gross_profit / spec["sale_price"], 4) if spec["sale_price"] else 0
    return {**spec, "gross_profit": gross_profit, "gross_margin": gross_margin}


def list_dishes() -> list[dict]:
    return [dish for dish in store.dishes.values() if dish.get("status") != "deleted"]


def create_dish(payload: DishCreate) -> dict:
    item = {"id": store.new_id("dish"), "deleted_at": None, **payload.model_dump()}
    store.dishes[item["id"]] = item
    return item


def update_dish(dish_id: str, payload: DishUpdate) -> dict:
    dish = store.dishes.get(dish_id)
    if not dish or dish.get("status") == "deleted":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    dish.update(payload.model_dump(exclude_unset=True))
    return dish


def check_dish_impact(dish_id: str) -> dict:
    dish = store.dishes.get(dish_id)
    if not dish:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")

    references = []
    risks = []

    linked_specs = [spec for spec in store.specifications.values() if spec["dish_id"] == dish_id]
    if linked_specs:
        references.append({
            "type": "specifications",
            "count": len(linked_specs),
            "details": [f"{spec['name']} (¥{spec['sale_price']})" for spec in linked_specs]
        })
        risks.append("删除后相关规格将保留用于历史报表，但无法再新增关联此菜品的规格")

    ingredient_ids = {spec.get("ingredient_id") for spec in linked_specs if spec.get("ingredient_id")}
    referenced_ingredients = set()
    for order in store.purchase_orders.values():
        for item in order.get("items", []):
            if item.get("ingredient_id") in ingredient_ids:
                referenced_ingredients.add(item["ingredient_id"])
    if referenced_ingredients:
        references.append({
            "type": "purchase",
            "count": len(referenced_ingredients),
            "details": [store.ingredients[i]["name"] for i in referenced_ingredients if i in store.ingredients]
        })
        risks.append("相关原料存在采购记录，删除菜品后历史采购分析可能受影响")

    has_report_refs = False
    report_specs = []
    for spec in linked_specs:
        report_specs.append(spec["name"])
        has_report_refs = True
    if has_report_refs:
        references.append({
            "type": "reports",
            "count": len(report_specs),
            "details": report_specs
        })
        risks.append("历史利润报表包含此菜品数据，删除后报表仍可查看但标记为已删除")

    return {
        "dish_id": dish_id,
        "dish_name": dish["name"],
        "has_references": len(references) > 0,
        "references": references,
        "spec_handling": "关联规格将保留以确保历史报表可正常计算，菜品标记为已删除后不再出现在新增选项中",
        "risks": risks
    }


def delete_dish(dish_id: str) -> None:
    if dish_id not in store.dishes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    dish = store.dishes[dish_id]
    dish["status"] = "deleted"
    dish["deleted_at"] = datetime.now()


def list_specifications(dish_id: str | None = None) -> list[dict]:
    specs = store.specifications.values()
    if dish_id:
        specs = [spec for spec in specs if spec["dish_id"] == dish_id]
    return [_spec_with_profit(spec) for spec in specs]


def create_specification(payload: SpecificationCreate) -> dict:
    if payload.dish_id not in store.dishes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    item = {"id": store.new_id("spec"), **payload.model_dump()}
    store.specifications[item["id"]] = item
    return _spec_with_profit(item)


def update_specification(spec_id: str, payload: SpecificationUpdate) -> dict:
    spec = store.specifications.get(spec_id)
    if not spec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specification not found")
    changes = payload.model_dump(exclude_unset=True)
    if changes.get("dish_id") and changes["dish_id"] not in store.dishes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    spec.update(changes)
    return _spec_with_profit(spec)


def delete_specification(spec_id: str) -> None:
    if spec_id not in store.specifications:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specification not found")
    store.specifications.pop(spec_id)

