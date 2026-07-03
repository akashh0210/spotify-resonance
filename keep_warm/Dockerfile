FROM python:3.11-slim

# Non-root user — no need for root inside the container.
RUN useradd --create-home appuser
WORKDIR /home/appuser/app
USER appuser

# Install deps before copying source so Docker layer cache survives
# source-only changes.
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

COPY --chown=appuser:appuser . .

# Ensures Python output is not buffered so structured logs appear
# in Render / Docker logs without delay.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/home/appuser/.local/bin:$PATH"

CMD ["python", "-m", "keep_warm.scheduler"]
