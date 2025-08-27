import path from 'path';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
    try {
        const filePath = path.join(process.cwd(), 'data', 'users.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const users = JSON.parse(fileContents);
        console.log(users);

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error reading users.json:', error);
        return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
    }
}
 
export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name } = body;
 
  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name };
  const filePath = path.join(process.cwd(), 'data', 'users.json'); 
  // JSON.stringify(data, null, 2) untuk format JSON yang rapi (pretty print)
  await fs.writeFile(filePath, JSON.stringify(newUser, null, 2), 'utf8');
 
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}