from fastapi import APIRouter

from app.schemas.finance import FinanceSummary, ProfitLine
from app.services import finance_service

router = APIRouter(tags=["finance"])


@router.get("/finance/profit-report", response_model=list[ProfitLine])
def get_profit_report() -> list[dict]:
    return finance_service.profit_report()


@router.get("/summary", response_model=FinanceSummary)
def get_summary() -> dict:
    return finance_service.summary()

