from fastapi import HTTPException, status

from app.data import store
from app.schemas.supply import PurchaseOrderCreate


def list_ingredients() -> list[dict]:
    return list(store.ingredients.values())


def list_suppliers() -> list[dict]:
    return list(store.suppliers.values())


def list_purchase_orders() -> list[dict]:
    return list(store.purchase_orders.values())


def create_purchase_order(payload: PurchaseOrderCreate) -> dict:
    if payload.supplier_id not in store.suppliers:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")

    total = 0.0
    for item in payload.items:
        if item.ingredient_id not in store.ingredients:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ingredient {item.ingredient_id} not found")
        total += item.qty * item.unit_price

    order = {
        "id": store.new_id("po"),
        **payload.model_dump(),
        "status": "ordered",
        "total_amount": round(total, 2),
    }
    store.purchase_orders[order["id"]] = order
    return order


def update_purchase_status(order_id: str, status_value: str) -> dict:
    order = store.purchase_orders.get(order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase order not found")

    previous_status = order["status"]
    order["status"] = status_value
    if status_value == "received" and previous_status != "received":
        for item in order["items"]:
            ingredient = store.ingredients[item["ingredient_id"]]
            ingredient["stock_qty"] = round(ingredient["stock_qty"] + item["qty"], 2)
            ingredient["avg_price"] = round(item["unit_price"], 2)
    return order

