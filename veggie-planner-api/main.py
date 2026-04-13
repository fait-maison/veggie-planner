import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from recipe_scrapers import SCRAPERS, scrape_html
from urllib.parse import urlparse

app = FastAPI(title="Veggie Planner API")


class ImportRequest(BaseModel):
    url: HttpUrl


def _is_supported(url: str) -> bool:
    host = urlparse(url).hostname or ""
    host_bare = host.removeprefix("www.")
    return host_bare in SCRAPERS or host in SCRAPERS


@app.post("/api/import")
async def import_recipe(body: ImportRequest):
    url = str(body.url)

    if not _is_supported(url):
        host = urlparse(url).hostname or url
        raise HTTPException(
            status_code=422,
            detail=f"Site non supporté : {host}. Consultez la liste des sites compatibles sur github.com/hhursev/recipe-scrapers.",
        )

    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            resp.raise_for_status()
        scraper = scrape_html(resp.text, org_url=url)
        return {"name": scraper.title(), "ingredients": scraper.ingredients()}
    except Exception:
        raise HTTPException(
            status_code=422, detail="Recette introuvable sur cette page"
        )


@app.get("/api/health")
async def health():
    return {"status": "ok"}
