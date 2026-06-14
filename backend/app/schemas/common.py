from pydantic import BaseModel, Field


class NamedItem(BaseModel):
    id: str
    name: str


class MoneyMixin(BaseModel):
    unit: str = Field(default="CNY", description="Currency code")

