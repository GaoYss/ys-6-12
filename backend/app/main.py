from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import dishes, finance, supply
from app.core.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dishes.router, prefix=settings.api_prefix)
app.include_router(supply.router, prefix=settings.api_prefix)
app.include_router(finance.router, prefix=settings.api_prefix)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

