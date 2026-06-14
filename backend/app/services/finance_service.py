from app.data import store
from app.services.catalog_service import _spec_with_profit


def profit_report() -> list[dict]:
    lines = []
    for spec in store.specifications.values():
        dish = store.dishes.get(spec["dish_id"])
        if not dish:
            continue
        enriched = _spec_with_profit(spec)
        lines.append(
            {
                "dish_id": dish["id"],
                "dish_name": dish["name"],
                "spec_name": enriched["name"],
                "sale_price": enriched["sale_price"],
                "cost": round(enriched["ingredient_cost"] + enriched["packaging_cost"], 2),
                "gross_profit": enriched["gross_profit"],
                "gross_margin": enriched["gross_margin"],
            }
        )
    return lines


def summary() -> dict:
    margins = [line["gross_margin"] for line in profit_report()]
    low_stock = [
        item
        for item in store.ingredients.values()
        if item["stock_qty"] <= item["safety_stock"]
    ]
    pending_orders = [
        order
        for order in store.purchase_orders.values()
        if order["status"] in {"draft", "ordered"}
    ]
    inventory_value = sum(item["stock_qty"] * item["avg_price"] for item in store.ingredients.values())
    return {
        "active_dishes": len([dish for dish in store.dishes.values() if dish["status"] == "active"]),
        "low_stock_items": len(low_stock),
        "pending_purchase_orders": len(pending_orders),
        "average_margin": round(sum(margins) / len(margins), 4) if margins else 0,
        "estimated_inventory_value": round(inventory_value, 2),
    }

