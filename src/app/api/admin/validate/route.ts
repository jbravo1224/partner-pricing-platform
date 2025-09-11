export async function GET() {
  return Response.json({ valid: true, message: 'Working v2', timestamp: new Date().toISOString() })
}
