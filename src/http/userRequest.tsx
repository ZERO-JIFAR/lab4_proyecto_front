const APIURL = import.meta.env.VITE_API_URL;
const usuarioURL = `${APIURL}/api/auth`;

// Define la estructura del payload para el registro de usuario
interface RegisterPayload {
    nombre: string;
    email: string;
    password: string;
}

// Define la estructura del payload para el inicio de sesión
interface LoginPayload {
    email: string;
    password: string;
}
// Define la estructura de la respuesta del inicio de sesión
interface LoginResponse {
    token: string;
    rol: string;
    email: string;
}

// Registra un nuevo usuario
export const registerUser = async ({ nombre, email, password }: RegisterPayload): Promise<void> => {
    const response = await fetch(`${usuarioURL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
    }
};

export const loginUser = async ({ email, password }: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${usuarioURL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        let errorMsg = 'Usuario o contraseña incorrectos. Por favor verifica tus datos.';
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch {
            // Si la respuesta no es JSON (por ejemplo, usuario deshabilitado)
            errorMsg = `Usuario no encontrado o deshabilitado con email: ${email}`;
        }
        throw new Error(errorMsg);
    }

    return await response.json(); // Devuelve { token, rol, email }
};

// --- NUEVAS FUNCIONES PARA ADMIN USUARIOS ---

const BACKEND_URL = 'http://localhost:9000';

function getToken() {
    return localStorage.getItem('token');
}

export const getAllUsers = async () => {
    const response = await fetch(`${BACKEND_URL}/usuarios`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
};

export const updateUser = async (id: number, data: any) => {
    const response = await fetch(`${BACKEND_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return await response.json();
};

export const deleteUser = async (id: number) => {
    const response = await fetch(`${BACKEND_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    if (!response.ok) throw new Error('Error al deshabilitar usuario');
    return true;
};

export const restoreUser = async (id: number) => {
    // Suponiendo que restaurar es actualizar el campo eliminado a false
    const response = await fetch(`${BACKEND_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ eliminado: false })
    });
    if (!response.ok) throw new Error('Error al habilitar usuario');
    return await response.json();
};