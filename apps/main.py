import os
import asyncio

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI
from apps.helper import load_config


def create_app():
    # Config loading
    config = load_config()

    # Client Setup
    api_key = os.getenv("OPENAI_API_KEY", None)
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set.")
    client = AsyncOpenAI(api_key=api_key)

    app = FastAPI(title=config["app"]["title"])

    # 2. The Concurrency Limiter (The "Traffic Light")
    # This ensures only N requests hit the LLM at the exact same time.
    # Others will automatically wait (pend) until a spot opens up.
    MAX_CONCURRENT_CALLS = config["llm"]["max_concurrent_calls"]
    limiter = asyncio.Semaphore(MAX_CONCURRENT_CALLS)

    # 3. Request Schema
    class PromptRequest(BaseModel):
        prompt: str

    @app.post("/invoke")
    async def invoke_llm(request: PromptRequest):
        # 'async with' ensures the slot is released even if the request fails
        async with limiter:
            try:
                # 4. LLM Integration
                # We use the 'await' keyword so the server stays responsive
                # while waiting for OpenAI's response.
                response = await client.chat.completions.create(
                    model=config["llm"]["model"],
                    messages=[{"role": "user", "content": request.prompt}],
                    timeout=config["llm"]["timeout"]
                )

                return {
                    "status": "success",
                    "answer": response.choices[0].message.content
                }

            except Exception as e:
                # Handle API errors (e.g., bad key, network issues)
                raise HTTPException(status_code=500, detail=str(e))

    return app




if __name__ == "__main__":
    config = load_config()
    app = create_app()
    import uvicorn
    uvicorn.run(
        app,
        host=config["app"]["host"],
        port=config["app"]["port"]
    )
