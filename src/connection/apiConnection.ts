const BASE_URL = "http://127.0.0.1:3000"; // Update with your backend URL

// Define the return type for the function
interface UserResponse {
    id: string;
    type: string;
    attributes: {
      email: string,
      name: string,
      document: string 
    };
}

export const createUser = async (
    name: string,
    email: string, 
    password: string, 
    passwordConfirmation: string,
    document: string
): Promise<UserResponse> => {
    const endpoint = "api/v1/users";

    // Crie o payload no mesmo formato usado no Insomnia
    const userData = {
        name,
        email, // Não encapsula em "user"
        password,
        password_confirmation: passwordConfirmation,
        document,
    };

    console.log("Payload enviado para API:", JSON.stringify(userData, null, 2)); // Log do payload

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Erro retornado pela API:", errorResponse);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Resposta da API:", result);
        return result.data as UserResponse; // Cast the response to the expected type
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
    }
};


interface LoginResponse {
    token: string; // Token retornado pela API
    user: {
      id: number;
      email: string;
      created_at: string;
      updated_at: string;
    };
  }
  

  export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const endpoint = "api/v1/auth/sign_in";
    const loginData = { email, password };
  
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Erro retornado pela API:", errorResponse);
        throw new Error(errorResponse.message || `Erro HTTP! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Resposta da API:", result);
      return result as LoginResponse; // Retorna o tipo esperado
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  export const getCourts = async (): Promise<any[]> => {
    const endpoint = "api/v1/courts";
    const token = localStorage.getItem("token");
  
    if (!token) {
      throw new Error("Usuário não autenticado. Token ausente.");
    }
  
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      // Validar se `result.data` é um array antes de processar
      if (!Array.isArray(result.data)) {
        throw new Error("Resposta inesperada: dados de quadras ausentes.");
      }
  
      // Processar e retornar quadras formatadas
      return result.data.map((court: any) => {
        if (!court.attributes) {
          throw new Error(`Quadra inválida: ${JSON.stringify(court)}`);
        }
  
        return {
          id: court.id,
          name: court.attributes.name || "Nome não especificado",
          maxPlayers: court.attributes.max_players || 0,
          category: court.attributes.category || "Categoria desconhecida",
          description: court.attributes.description || "Sem descrição",
          price: court.attributes.price || 0,
          status: court.attributes.status || "Indisponível",
        };
      });
    } catch (error) {
      console.error("Erro ao buscar quadras:", error);
      throw error;
    }
  };
  
  