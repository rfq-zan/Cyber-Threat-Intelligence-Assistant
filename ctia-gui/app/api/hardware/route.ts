import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const flaskResponse = await fetch(`${process.env.FLASK_BACKEND_URL?.replace('/query', '/hardware') || 'http://127.0.0.1:5000/api/v1/hardware'}`, {
      method: 'GET',
      cache: 'no-store', 
    });

    if (!flaskResponse.ok) {
      return NextResponse.json({ error: "Hardware ping rejected by backend" }, { status: flaskResponse.status });
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('[NEXTJS-HARDWARE-PROXY-ERROR]:', error);
    return NextResponse.json(
      { 
        status: "failed",
        hardware: {
          gpu_model: "Connection Lost",
          vram_gb: 0,
          ram_gb: 0,
          cpu_cores: 0
        }
      },
      { status: 500 }
    );
  }
}