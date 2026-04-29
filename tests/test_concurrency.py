"""
Concurrency limit test script.

This script sends 50 concurrent requests to the /invoke endpoint
and verifies that the concurrency limit (20) is respected.

Run with:
    python tests/test_concurrency.py

Make sure the server is running:
    uvicorn apps.main:app --host 0.0.0.0 --port 8000
"""

import asyncio
import time
from datetime import datetime
import httpx

# Configuration
BASE_URL = "http://127.0.0.1:8000"
NUM_REQUESTS = 50
CONCURRENCY_LIMIT = 20

# Tracking metrics
in_flight = 0
max_concurrent = 0
lock = asyncio.Lock()
request_times = []


async def send_request(client: httpx.AsyncClient, request_id: int):
    """Send a single request and track timing."""
    global in_flight, max_concurrent

    async with lock:
        in_flight += 1
        max_concurrent = max(max_concurrent, in_flight)
        start_time = datetime.now()
        print(f"[{start_time.strftime('%H:%M:%S.%f')[:-3]}] Request #{request_id:02d} STARTED | In-flight: {in_flight}/{CONCURRENCY_LIMIT}")

    try:
        start = time.time()
        response = await client.post(
            f"{BASE_URL}/invoke",
            json={"prompt": f"Test prompt {request_id}"},
            timeout=60.0
        )
        elapsed = time.time() - start

        async with lock:
            in_flight -= 1
            end_time = datetime.now()
            print(f"[{end_time.strftime('%H:%M:%S.%f')[:-3]}] Request #{request_id:02d} DONE | {elapsed:.2f}s | In-flight: {in_flight}/{CONCURRENCY_LIMIT} | Status: {response.status_code}")
            request_times.append({
                "id": request_id,
                "duration": elapsed,
                "status": response.status_code
            })

        return response.status_code == 200

    except Exception as e:
        async with lock:
            in_flight -= 1
            end_time = datetime.now()
            print(f"[{end_time.strftime('%H:%M:%S.%f')[:-3]}] Request #{request_id:02d} FAILED | Error: {str(e)}")

        return False


async def run_concurrency_test():
    """Run the concurrency test."""
    print(f"\n{'='*70}")
    print(f"Concurrency Limit Test")
    print(f"{'='*70}")
    print(f"Sending {NUM_REQUESTS} concurrent requests...")
    print(f"Expected concurrency limit: {CONCURRENCY_LIMIT}")
    print(f"Server: {BASE_URL}")
    print(f"{'='*70}\n")

    start_time = time.time()

    async with httpx.AsyncClient() as client:
        # Send all 50 requests concurrently
        tasks = [send_request(client, i + 1) for i in range(NUM_REQUESTS)]
        results = await asyncio.gather(*tasks)

    elapsed_time = time.time() - start_time

    # Print results
    print(f"\n{'='*70}")
    print(f"Test Results")
    print(f"{'='*70}")
    print(f"Total requests sent: {NUM_REQUESTS}")
    print(f"Successful responses: {sum(results)}")
    print(f"Failed responses: {NUM_REQUESTS - sum(results)}")
    print(f"Total time: {elapsed_time:.2f}s")
    print(f"Max concurrent requests observed: {max_concurrent}")
    print(f"\nConcurrency Limit Respected: {'✓ YES' if max_concurrent <= CONCURRENCY_LIMIT else '✗ NO'}")

    if max_concurrent > CONCURRENCY_LIMIT:
        print(f"  ⚠️  Exceeded limit! Max was {max_concurrent}, expected ≤ {CONCURRENCY_LIMIT}")
    else:
        print(f"  ✓ All requests stayed within the {CONCURRENCY_LIMIT} limit")

    print(f"{'='*70}\n")


if __name__ == "__main__":
    try:
        asyncio.run(run_concurrency_test())
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user.")
    except Exception as e:
        print(f"\n\nError running test: {str(e)}")
        print("Make sure the server is running on http://127.0.0.1:8000")
