import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/mongoose.config.js';
import CourtModel from '../../../models/court.model.js';

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params; // Obtener el ID desde los parámetros

    if (!id) {
      return NextResponse.json({ error: 'El ID es requerido.' }, { status: 400 });
    }

    // Buscar la cancha por su ID y populando los jugadores
    const court = await CourtModel.findById(id).populate('players');

    if (!court) {
      return NextResponse.json({ error: 'Cancha no encontrada.' }, { status: 404 });
    }

    return NextResponse.json(court); // Retornar la cancha encontrada
  } catch (error) {
    console.error('Error al obtener la cancha:', error);
    return NextResponse.json({ error: 'Error al obtener la cancha.' }, { status: 500 });
  }
}