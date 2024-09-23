import { NextResponse } from 'next/server';
import { connectDB } from '../../../../config/mongoose.config';
import CourtModel from '../../../../models/court.model.js';
import PlayerModel from '../../../../models/player.model.js';

export async function POST(req, { params }) {
    try {
        await connectDB();

        const { id } = params; // ID de la cancha
        const { email } = await req.json(); // Email del jugador

        if (!id || !email) {
            return NextResponse.json({ error: 'El ID de la cancha y el email del jugador son requeridos.' }, { status: 400 });
        }

        const court = await CourtModel.findById(id);
        if (!court) {
            return NextResponse.json({ error: 'Cancha no encontrada.' }, { status: 404 });
        }

        const player = await PlayerModel.findById(email);
        if (!player) {
            return NextResponse.json({ error: 'Jugador no encontrado.' }, { status: 404 });
        }

        // Verifica si el jugador ya está en la lista
        if (court.players.includes(email)) {
            return NextResponse.json({ error: 'El jugador ya está en la cancha.' }, { status: 400 });
        }

        // Obtener todos los jugadores de la cancha
        const playersData = await PlayerModel.find({ _id: { $in: court.players } });

        // Contar jugadores por posición
        const forehandCount = playersData.filter(p => p.position === 'Forehand').length;
        const backhandCount = playersData.filter(p => p.position === 'Backhand').length;

        // Verificar restricciones de posiciones
        if (player.position === 'Forehand' && forehandCount >= 2) {
            return NextResponse.json({ error: 'Solo se permiten 2 jugadores Forehand.' }, { status: 400 });
        }
        if (player.position === 'Backhand' && backhandCount >= 2) {
            return NextResponse.json({ error: 'Solo se permiten 2 jugadores Backhand.' }, { status: 400 });
        }
        if (court.players.length >= 4) {
            return NextResponse.json({ error: 'No se pueden agregar más de 4 jugadores a la cancha.' }, { status: 400 });
        }

        // Agregar el jugador
        court.players.push(email);
        await court.save();

        // Obtener los datos de todos los jugadores en la cancha
        const updatedPlayersData = await PlayerModel.find({ _id: { $in: court.players } });

        return NextResponse.json({
            court,
            players: updatedPlayersData
        });
    } catch (error) {
        console.error('Error al agregar el jugador a la cancha:', error);
        return NextResponse.json({ error: 'Error al agregar el jugador a la cancha.' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = params; // ID de la cancha
        const { email } = await req.json(); // Email del jugador

        if (!id || !email) {
            return NextResponse.json({ error: 'El ID de la cancha y el email del jugador son requeridos.' }, { status: 400 });
        }

        const court = await CourtModel.findById(id);
        if (!court) {
            return NextResponse.json({ error: 'Cancha no encontrada.' }, { status: 404 });
        }

        // Verifica si el jugador está en la lista
        if (!court.players.includes(email)) {
            return NextResponse.json({ error: 'El jugador no está en la cancha.' }, { status: 400 });
        }

        // Eliminar el jugador de la lista
        court.players = court.players.filter(playerEmail => playerEmail !== email);
        await court.save();

        // Obtener los datos actualizados de los jugadores en la cancha
        const updatedPlayersData = await PlayerModel.find({ _id: { $in: court.players } });

        return NextResponse.json({
            court,
            players: updatedPlayersData
        });
    } catch (error) {
        console.error('Error al eliminar el jugador de la cancha:', error);
        return NextResponse.json({ error: 'Error al eliminar el jugador de la cancha.' }, { status: 500 });
    }
}