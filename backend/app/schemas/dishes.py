from pydantic import BaseModel, Field


class DishBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    category: str = Field(min_length=1, max_length=40)
    flavor: str = Field(min_length=1, max_length=40)
    status: str = Field(default="active", pattern="^(active|paused|seasonal)$")
    description: str = Field(default="", max_length=300)


class DishCreate(DishBase):
    pass


class DishUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    category: str | None = Field(default=None, min_length=1, max_length=40)
    flavor: str | None = Field(default=None, min_length=1, max_length=40)
    status: str | None = Field(default=None, pattern="^(active|paused|seasonal)$")
    description: str | None = Field(default=None, max_length=300)


class Dish(DishBase):
    id: str


class SpecificationBase(BaseModel):
    dish_id: str
    name: str = Field(min_length=1, max_length=60)
    serving_size: str = Field(min_length=1, max_length=60)
    sale_price: float = Field(gt=0)
    ingredient_cost: float = Field(ge=0)
    packaging_cost: float = Field(ge=0)


class SpecificationCreate(SpecificationBase):
    pass


class SpecificationUpdate(BaseModel):
    dish_id: str | None = None
    name: str | None = Field(default=None, min_length=1, max_length=60)
    serving_size: str | None = Field(default=None, min_length=1, max_length=60)
    sale_price: float | None = Field(default=None, gt=0)
    ingredient_cost: float | None = Field(default=None, ge=0)
    packaging_cost: float | None = Field(default=None, ge=0)


class Specification(SpecificationBase):
    id: str
    gross_profit: float
    gross_margin: float

