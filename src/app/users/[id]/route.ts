import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

async function getUserData(): Promise<User[]> {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

async function saveUserData(data: User[]) {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const users = await getUserData();
    const user = users.find((u) => u.id.toString() === id);

    if (!user) {
      return NextResponse.json({ message: `User dengan ID ${id} tidak ditemukan` }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
    
  } catch (error) {
    console.error('Error reading users.json:', error);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}
 
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const allUsers = await getUserData();

    // Cek apakah user dengan ID tersebut ada
    const userExists = allUsers.some(user => user.id.toString() === id);
    if (!userExists) {
      return NextResponse.json({ message: `User dengan ID ${id} tidak ditemukan` }, { status: 404 });
    }

    // Buat array baru tanpa user yang akan dihapus
    const updatedUsers = allUsers.filter(user => user.id.toString() !== id);

    // Tulis kembali data yang sudah diperbarui ke file
    await saveUserData(updatedUsers);
    
    // Kirim respons berhasil
    return NextResponse.json({ message: `User dengan ID ${id} berhasil dihapus` }, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus data pengguna' }, { status: 500 });
  }
}