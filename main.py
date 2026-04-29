"""ASGI entrypoint shim.

Allows running from repository root with:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from apps.main import create_app

app = create_app()
