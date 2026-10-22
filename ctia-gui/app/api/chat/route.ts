import { NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number, startTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; 
const MAX_REQUESTS = 3; 

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown_ip';
    
    const currentTime = Date.now();
    const rateData = rateLimitMap.get(ip);

    if (rateData) {
      if (currentTime - rateData.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, startTime: currentTime });
      } else {
        rateData.count++;
        
        if (rateData.count > MAX_REQUESTS) {
          console.warn(`[SECURITY] DoS mitigated. Rate limit exceeded for IP: ${ip}`);
          
          return NextResponse.json(
            { 
              answer: "> [SECURITY BREACH DETECTED]: Traffic anomaly detected. Rate limit exceeded (Max 5 req/min). Connection temporarily suspended to protect inference hardware.", 
              status: "blocked",
              topic_summary: "RATE_LIMIT_EXCEEDED"
            }, 
            { status: 429 }
          );
        }
      }
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: currentTime });
    }

    console.log(`[NEXT.JS] Cleared Firewall. Received valid request from ${ip}...`);
    const body = await request.json();
    
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json({ error: "Invalid query payload" }, { status: 400 });
    }

    console.log(`[NEXT.JS] Forwarding to Python: "${body.query.substring(0, 30)}..." with K=${body.k_retrieval}`);

    const flaskResponse = await fetch('http://127.0.0.1:5000/api/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: body.query.trim(),
        history: Array.isArray(body.history) ? body.history : [],
        k_retrieval: body.k_retrieval || 15,
        n_attack: body.n_attack || 4,
        n_mitigation: body.n_mitigation || 2
      }),
      cache: 'no-store',
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return NextResponse.json(errorData, { status: flaskResponse.status });
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("[NEXT.JS CRITICAL ERROR]:", error);
    return NextResponse.json(
      { 
        answer: "> [NETWORK ERROR]: Proxy Node.js failed to contact the Python Backend.", 
        status: "failed" 
      },
      { status: 500 }
    );
  }
}