import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from recipe_scrapers import scrape_html

app = FastAPI(title="Veggie Planner API")


class ImportRequest(BaseModel):
    url: HttpUrl


@app.post("/api/import")
async def import_recipe(body: ImportRequest):
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(
                str(body.url),
                headers={"User-Agent": "Mozilla/5.0"},
            )
            resp.raise_for_status()
        scraper = scrape_html(resp.text, org_url=str(body.url))
        return {"name": scraper.title(), "ingredients": scraper.ingredients()}
    except Exception:
        raise HTTPException(
            status_code=422, detail="Recette introuvable sur cette page"
        )


@app.get("/api/health")
async def health():
    return {"status": "ok"}
