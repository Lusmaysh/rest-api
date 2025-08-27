import path from 'path';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { create } from 'domain';

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
  const body = await request.json();
  const { name, email, role } = body;
  
  const now = new Date().toISOString();
  const newUser = { 
    id: Date.now(), 
    name, 
    email,
    role,
    created_at: now,
    updated_at: now 
  };
  const filePath = path.join(process.cwd(), 'data', 'users.json');

  // Baca data lama
  let users: any[] = [];
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    users = JSON.parse(fileContents);
    if (!Array.isArray(users)) users = [];
  } catch (error) {
    // Jika file belum ada atau error, mulai dengan array kosong
    users = [];
  }

  users.push(newUser);

  await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}