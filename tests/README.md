# Tests

## Concurrency Limit Test

This test verifies that the concurrency limiter (Semaphore with limit=20) is working correctly.

### What it does

- Sends 50 concurrent HTTP requests to the `/invoke` endpoint
- Tracks how many requests are "in flight" at any given time
- Verifies that the number never exceeds the configured limit (20)
- Displays real-time logs showing when requests start and complete

### How to run

**Step 1: Start the server in one terminal:**
```bash
export OPENAI_API_KEY="sk-..."  # Your OpenAI API key
python apps/main.py
```

or

```bash
uvicorn apps.main:app --host 0.0.0.0 --port 8000
```

**Step 2: Run the test in another terminal:**
```bash
python tests/test_concurrency.py
```

### Expected output

You should see:
1. Real-time logs showing requests starting and finishing
2. Each line displays: timestamp, request ID, status, elapsed time, and current in-flight count
3. A summary at the end showing:
   - Total requests sent
   - Successful responses
   - Max concurrent requests observed
   - Confirmation that concurrency limit was respected

Example:
```
======================================================================
Concurrency Limit Test
======================================================================
Sending 50 concurrent requests...
Expected concurrency limit: 20
Server: http://127.0.0.1:8000
======================================================================

[14:23:45.123] Request #01 STARTED | In-flight: 1/20
[14:23:45.124] Request #02 STARTED | In-flight: 2/20
...
[14:23:45.234] Request #01 DONE | 0.11s | In-flight: 19/20 | Status: 200
...

======================================================================
Test Results
======================================================================
Total requests sent: 50
Successful responses: 50
Failed responses: 0
Total time: 5.32s
Max concurrent requests observed: 20

Concurrency Limit Respected: ✓ YES
  ✓ All requests stayed within the 20 limit
======================================================================
```

### What this proves

- The semaphore is correctly limiting concurrent requests to 20
- Requests queue up and wait for a slot to become available
- No more than 20 requests are processed simultaneously
- All 50 requests eventually complete successfully
