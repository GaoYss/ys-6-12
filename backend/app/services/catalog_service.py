from fastapi import HTTPException, status

from app.data import store
from app.schemas.dishes import DishCreate, DishUpdate, SpecificationCreate, SpecificationUpdate


def _spec_with_profit(spec: dict) -> dict:
    cost = spec["ingredient_cost"] + spec["packaging_cost"]
    gross_profit = round(spec["sale_price"] - cost, 2)
    gross_margin = round(gross_profit / spec["sale_price"], 4) if spec["sale_price"] else 0
    return {**spec, "gross_profit": gross_profit, "gross_margin": gross_margin}


def list_dishes() -> list[dict]:
    return list(store.dishes.values())


def create_dish(payload: DishCreate) -> dict:
    item = {"id": store.new_id("dish"), **payload.model_dump()}
    store.dishes[item["id"]] = item
    return item


def update_dish(dish_id: str, payload: DishUpdate) -> dict:
    dish = store.dishes.get(dish_id)
    if not dish:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    dish.update(payload.model_dump(exclude_unset=True))
    return dish


def delete_dish(dish_id: str) -> None:
    if dish_id not in store.dishes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    linked_specs = [spec_id for spec_id, spec in store.specifications.items() if spec["dish_id"] == dish_id]
    for spec_id in linked_specs:
        store.specifications.pop(spec_id)
    store.dishes.pop(dish_id)


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

