import { NextResponse } from 'next/server';
import { connectDB } from '../../config/mongoose.config';
import PlayerModel from '../../models/player.model.js';

export async function GET() {
    try {
      await connectDB();
      const players = await PlayerModel.find();
      return NextResponse.json(players);
    } catch (error) {
      return NextResponse.json({ error: 'Error al obtener las canchas' }, { status: 500 });
    }
}

export async function POST(req) {
  try {
      await connectDB();
      const body = await req.json();

      console.log('Received body:', body); // Verificar la solicitud

      // Verificar que el email esté presente en el body
      const { _id, image, name, lastname, category, gender, position, phone } = body;

      if (!_id) {
          return NextResponse.json({ error: 'El email es requerido.' }, { status: 400 });
      }

      console.log('Email:', _id); // Asegúrate de que el email no sea null

      // Verificar si el jugador ya existe
      const existingPlayer = await PlayerModel.findOne({ _id });
      
      if (existingPlayer) {
          return NextResponse.json({ error: 'El email ya está en uso.' }, { status: 400 });
      }

      const newPlayer = new PlayerModel({
        _id,
        image,
        name,
        lastname,
        category,
        gender,
        position,
        phone,
    });    

      await newPlayer.save();
      return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
      console.error('Error al agregar el jugador:', error);
      return NextResponse.json({ error: 'Error al agregar el jugador.', details: error.message }, { status: 500 });
  }
}
