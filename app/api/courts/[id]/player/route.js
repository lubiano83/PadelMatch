import { NextResponse } from 'next/server';
import { connectDB } from '../../../../config/mongoose.config.js';
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

        // Buscar la cancha y poblar los jugadores
        const court = await CourtModel.findById(id).populate('players'); 
        if (!court) {
            return NextResponse.json({ error: 'Cancha no encontrada.' }, { status: 404 });
        }

        // Verificar que el jugador existe
        const player = await PlayerModel.findById(email);
        if (!player) {
            return NextResponse.json({ error: 'Jugador no encontrado.' }, { status: 404 });
        }

        // Verificar si el jugador ya está en la lista
        const playerExists = court.players.some(p => p._id.toString() === player._id.toString());
        if (playerExists) {
            return NextResponse.json({ error: 'El jugador ya está en la cancha.' }, { status: 400 });
        }

        // Contar jugadores por posición
        const forehandCount = court.players.filter(p => p.position === 'Forehand').length;
        const backhandCount = court.players.filter(p => p.position === 'Backhand').length;

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

        // Agregar el jugador solo con su ID
        court.players.push(player._id);
        await court.save();

        // Retornar solo el objeto de la cancha con el array de jugadores poblado
        const updatedCourt = await CourtModel.findById(id).populate('players');

        return NextResponse.json({
            court: updatedCourt
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

        const court = await CourtModel.findById(id).populate('players'); // Usar populate aquí
        if (!court) {
            return NextResponse.json({ error: 'Cancha no encontrada.' }, { status: 404 });
        }

        // Verifica si el jugador está en la lista usando el ID del jugador
        const playerExists = court.players.some(player => player._id.toString() === email);
        if (!playerExists) {
            return NextResponse.json({ error: 'El jugador no está en la cancha.' }, { status: 400 });
        }

        // Eliminar el jugador de la lista
        court.players = court.players.filter(player => player._id.toString() !== email);
        await court.save();

        // Obtener los datos actualizados de la cancha con populate
        const updatedCourt = await CourtModel.findById(id).populate('players');

        return NextResponse.json({
            court: updatedCourt // Retornar la cancha con los jugadores actualizados
        });
    } catch (error) {
        console.error('Error al eliminar el jugador de la cancha:', error);
        return NextResponse.json({ error: 'Error al eliminar el jugador de la cancha.' }, { status: 500 });
    }
}