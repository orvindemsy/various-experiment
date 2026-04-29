# syntax=docker/dockerfile:1
ARG BASE_IMAGE=ubuntu:22.04
FROM ${BASE_IMAGE}

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    ssh \
    git-core \
    vim \
    wget \
    curl \
    tmux \
    htop \
    ca-certificates \
    rsync \
    unzip \
    bzip2 \
    make \
    build-essential \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 TZ=UTC
ENV PYTHON_VERSION=3.10.18
COPY --from=ghcr.io/astral-sh/uv:0.8.17 /uv /uvx /root/.local/bin/
ENV PATH=/root/.local/bin:${PATH}

ENV UV_PYTHON_INSTALL_DIR=/python UV_PYTHON_PREFERENCE=only-managed
RUN uv python install ${PYTHON_VERSION}
ENV UV_PYTHON_DOWNLOADS=0

ENV UV_PROJECT_ENVIRONMENT="/python-venv" PATH="/python-venv/bin:${PATH}"
ENV PYTHONPATH=/app:/app/src:$PYTHONPATH
ENV PYTHONDONTWRITEBYTECODE=1

# Install dependencies only (not the project) from uv.lock for reproducibility.
COPY pyproject.toml uv.lock /app/
RUN uv sync --frozen --no-dev --no-install-project --no-cache

COPY . .
