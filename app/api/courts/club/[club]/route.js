import { NextResponse } from 'next/server';
import { connectDB } from '../../../../config/mongoose.config.js';
import CourtModel from '../../../../models/court.model.js';

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Obtener el parámetro 'club' de la URL
    const { club } = params;

    if (!club) {
      return NextResponse.json({ error: 'El nombre del club es requerido.' }, { status: 400 });
    }

    // Buscar todas las canchas del club especificado
    const courts = await CourtModel.find({ club: club });

    if (courts.length === 0) {
      return NextResponse.json({ message: 'No se encontraron canchas para este club.' }, { status: 404 });
    }

    // Retornar la lista de canchas del club
    return NextResponse.json(courts, { status: 200 });
  } catch (error) {
    console.error('Error al obtener las canchas del club:', error.message);
    return NextResponse.json({ error: 'Error al obtener las canchas.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { club } = params;
    const { id } = await request.json();

    if (!club || !id) {
      return NextResponse.json({ error: 'Se requieren el nombre del club y el ID.' }, { status: 400 });
    }

    const deletedCourt = await CourtModel.findOneAndDelete({ 
      _id: id, 
      club: club 
    });

    if (!deletedCourt) {
      return NextResponse.json({ error: 'No se encontró la cancha con el ID proporcionado en el club especificado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cancha eliminada correctamente.' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar la cancha:', error.message);
    return NextResponse.json({ error: 'Error al eliminar la cancha.' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { club } = params;
    const { id, courtNumber, matchStart, matchEnd, players } = await request.json();

    if (!club || !id) {
      return NextResponse.json({ error: 'Se requieren el nombre del club y el ID.' }, { status: 400 });
    }

    const updatedCourt = await CourtModel.findOneAndUpdate(
      { _id: id, club: club },
      { 
        courtNumber,
        matchStart: new Date(matchStart),
        matchEnd: new Date(matchEnd),
        players
      },
      { new: true }
    );

    if (!updatedCourt) {
      return NextResponse.json({ error: 'No se encontró la cancha con el ID proporcionado en el club especificado.' }, { status: 404 });
    }

    return NextResponse.json(updatedCourt, { status: 200 });
  } catch (error) {
    console.error('Error al modificar la cancha:', error.message);
    return NextResponse.json({ error: 'Error al modificar la cancha.' }, { status: 500 });
  }
}


