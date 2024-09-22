import { connect, Types } from 'mongoose';

const connectDB = async () => {
  const URI = process.env.MONGODB_URI;

  if (!URI) {
    throw new Error('La URI de MongoDB no está definida en las variables de entorno');
  }

  try {
    await connect(URI, {
      dbName: 'myPadelApp', // Nombre de la base de datos
    });
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error.message);
    throw new Error('Error al conectar a la base de datos');
  }
};

const isValidId = (id) => {
  return Types.ObjectId.isValid(id); // Devuelve true o false
};

// Exportar las funciones individualmente
export { connectDB, isValidId };
