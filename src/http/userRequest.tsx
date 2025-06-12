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

// Inicia sesión y devuelve el token, rol y email del usuario
export const loginUser = async ({ email, password }: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${usuarioURL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
    }

  return await response.json(); // Devuelve { token, rol, email }
};