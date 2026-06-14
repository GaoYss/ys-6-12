from fastapi import APIRouter, Response, status

from app.schemas.dishes import Dish, DishCreate, DishUpdate, Specification, SpecificationCreate, SpecificationUpdate
from app.services import catalog_service

router = APIRouter(tags=["dishes"])


@router.get("/dishes", response_model=list[Dish])
def get_dishes() -> list[dict]:
    return catalog_service.list_dishes()


@router.post("/dishes", response_model=Dish, status_code=status.HTTP_201_CREATED)
def post_dish(payload: DishCreate) -> dict:
    return catalog_service.create_dish(payload)


@router.put("/dishes/{dish_id}", response_model=Dish)
def put_dish(dish_id: str, payload: DishUpdate) -> dict:
    return catalog_service.update_dish(dish_id, payload)


@router.delete("/dishes/{dish_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_dish(dish_id: str) -> Response:
    catalog_service.delete_dish(dish_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/specifications", response_model=list[Specification])
def get_specifications(dish_id: str | None = None) -> list[dict]:
    return catalog_service.list_specifications(dish_id)


@router.post("/specifications", response_model=Specification, status_code=status.HTTP_201_CREATED)
def post_specification(payload: SpecificationCreate) -> dict:
    return catalog_service.create_specification(payload)


@router.put("/specifications/{spec_id}", response_model=Specification)
def put_specification(spec_id: str, payload: SpecificationUpdate) -> dict:
    return catalog_service.update_specification(spec_id, payload)


@router.delete("/specifications/{spec_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_specification(spec_id: str) -> Response:
    catalog_service.delete_specification(spec_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

