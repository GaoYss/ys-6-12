from pydantic import BaseModel


class ProfitLine(BaseModel):
    dish_id: str
    dish_name: str
    spec_name: str
    sale_price: float
    cost: float
    gross_profit: float
    gross_margin: float


class FinanceSummary(BaseModel):
    active_dishes: int
    low_stock_items: int
    pending_purchase_orders: int
    average_margin: float
    estimated_inventory_value: float

