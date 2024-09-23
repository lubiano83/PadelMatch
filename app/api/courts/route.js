import { NextResponse } from 'next/server';
import { connectDB } from '../../config/mongoose.config.js';
import CourtModel from '../../models/court.model.js';

export async function GET() {
  try {
    await connectDB();
    const courts = await CourtModel.find()
      .populate('players') // Asegúrate de que 'players' esté correctamente referenciado en tu modelo
      .sort({ createdAt: -1 });

    return NextResponse.json(courts);
  } catch (error) {
    console.error('Error al obtener las canchas:', error.message);
    return NextResponse.json({ error: 'Error al obtener las canchas' }, { status: 500 });
  }
}