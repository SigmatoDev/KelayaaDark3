import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export async function GET() {
  try {
    await dbConnect();

    // Check if admin user already exists
    const existingUser = await UserModel.findOne({ email: 'rudresh96@gmail.com' });
    if (existingUser) {
      return NextResponse.json({ message: 'Admin user already exists' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('123456', 10);
    const newUser = new UserModel({
      name: 'Rudresh',
      email: 'rudresh96@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    });

    await newUser.save();
    
    return NextResponse.json({ 
      message: 'Admin user created successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 