from fastapi import APIRouter, status

from app.schemas.supply import Ingredient, PurchaseOrder, PurchaseOrderCreate, PurchaseStatusUpdate, Supplier
from app.services import supply_service

router = APIRouter(tags=["supply"])


@router.get("/ingredients", response_model=list[Ingredient])
def get_ingredients() -> list[dict]:
    return supply_service.list_ingredients()


@router.get("/suppliers", response_model=list[Supplier])
def get_suppliers() -> list[dict]:
    return supply_service.list_suppliers()


@router.get("/purchase-orders", response_model=list[PurchaseOrder])
def get_purchase_orders() -> list[dict]:
    return supply_service.list_purchase_orders()


@router.post("/purchase-orders", response_model=PurchaseOrder, status_code=status.HTTP_201_CREATED)
def post_purchase_order(payload: PurchaseOrderCreate) -> dict:
    return supply_service.create_purchase_order(payload)


@router.patch("/purchase-orders/{order_id}/status", response_model=PurchaseOrder)
def patch_purchase_status(order_id: str, payload: PurchaseStatusUpdate) -> dict:
    return supply_service.update_purchase_status(order_id, payload.status)

