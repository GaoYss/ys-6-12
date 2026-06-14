from datetime import date

from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    id: str
    name: str
    category: str
    stock_qty: float
    unit: str
    safety_stock: float
    avg_price: float


class Supplier(BaseModel):
    id: str
    name: str
    contact: str
    rating: float


class PurchaseOrderItem(BaseModel):
    ingredient_id: str
    qty: float = Field(gt=0)
    unit_price: float = Field(gt=0)


class PurchaseOrderCreate(BaseModel):
    supplier_id: str
    expected_arrival: date
    items: list[PurchaseOrderItem] = Field(min_length=1)
    remark: str = Field(default="", max_length=240)


class PurchaseOrder(PurchaseOrderCreate):
    id: str
    status: str
    total_amount: float


class PurchaseStatusUpdate(BaseModel):
    status: str = Field(pattern="^(draft|ordered|received|cancelled)$")

