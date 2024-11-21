import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { command } = await request.json()
    
    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      )
    }

    const { stdout, stderr } = await execAsync(command)
    
    return NextResponse.json({
      success: !stderr,
      output: stderr || stdout
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      output: error.message
    }, { status: 500 })
  }
}
