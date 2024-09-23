import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/mongoose.config.js';
import PlayerModel from '../../../models/player.model.js';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params; // Obtener el ID desde los parámetros

        if (!id) {
            return NextResponse.json({ error: 'El ID es requerido.' }, { status: 400 });
        }

        const player = await PlayerModel.findById(id); // Buscar el jugador por su ID

        if (!player) {
            return NextResponse.json({ error: 'Jugador no encontrado.' }, { status: 404 });
        }

        return NextResponse.json(player); // Retornar el jugador encontrado
    } catch (error) {
        console.error('Error al obtener el jugador:', error);
        return NextResponse.json({ error: 'Error al obtener el jugador.' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params; // Obtener el ID desde los parámetros

        if (!id) {
            return NextResponse.json({ error: 'El ID es requerido.' }, { status: 400 });
        }

        const body = await req.json(); // Obtener los datos actualizados del cuerpo de la solicitud

        // Actualizar el jugador por su ID
        const updatedPlayer = await PlayerModel.findByIdAndUpdate(id, body, {
            new: true, // Retornar el documento actualizado
            runValidators: true, // Aplicar validaciones del modelo
        });

        if (!updatedPlayer) {
            return NextResponse.json({ error: 'Jugador no encontrado.' }, { status: 404 });
        }

        return NextResponse.json(updatedPlayer); // Retornar el jugador actualizado
    } catch (error) {
        console.error('Error al actualizar el jugador:', error);
        return NextResponse.json({ error: 'Error al actualizar el jugador.' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        
        const { id } = params; // Obtener el ID desde los parámetros

        if (!id) {
            return NextResponse.json({ error: 'El ID es requerido.' }, { status: 400 });
        }

        // Eliminar el jugador por su ID
        const deletedPlayer = await PlayerModel.findByIdAndDelete(id);

        if (!deletedPlayer) {
            return NextResponse.json({ error: 'Jugador no encontrado.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Jugador eliminado exitosamente.' }); // Retornar mensaje de éxito
    } catch (error) {
        console.error('Error al eliminar el jugador:', error);
        return NextResponse.json({ error: 'Error al eliminar el jugador.' }, { status: 500 });
    }
}
