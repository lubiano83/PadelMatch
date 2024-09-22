import { NextResponse } from 'next/server';
import { connectDB } from '../../config/mongoose.config';
import CourtModel from '../../models/court.model.js';

export async function GET() {
  try {
    await connectDB();
    const courts = await CourtModel.find().sort({ createdAt: -1 });
    return NextResponse.json(courts);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener las canchas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const currentDateTime = new Date();

    if (new Date(body.matchStart) < currentDateTime) {
      return NextResponse.json({ error: 'La hora de inicio no puede ser anterior a la fecha y hora actuales.' }, { status: 400 });
    }

    const courtConflict = await CourtModel.findOne({
      club: body.club,
      courtNumber: body.courtNumber,
      $or: [
        {
          matchStart: { $lt: new Date(body.matchEnd), $gt: new Date(body.matchStart) },
        },
        {
          matchEnd: { $gt: new Date(body.matchStart), $lt: new Date(body.matchEnd) },
        },
        {
          matchStart: { $lte: new Date(body.matchStart) },
          matchEnd: { $gte: new Date(body.matchEnd) },
        }
      ]
    });

    if (courtConflict) {
      return NextResponse.json({ error: 'Ya existe un partido en esta cancha dentro del rango de tiempo especificado.' }, { status: 400 });
    }

    const newCourt = new CourtModel({
      club: body.club,
      email: body.email,
      phone: body.phone,
      category: body.category,
      courtNumber: body.courtNumber,
      matchStart: new Date(body.matchStart),
      matchEnd: new Date(body.matchEnd),
      players: body.players
    });    

    console.log('Objeto a guardar:', newCourt);

    await newCourt.save();
    return NextResponse.json(newCourt, { status: 201 });
  } catch (error) {
    console.error('Error al agregar la cancha:', error.message);
    return NextResponse.json({ error: 'Error al agregar la cancha' }, { status: 500 });
  }
}







