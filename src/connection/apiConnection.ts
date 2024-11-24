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

  interface AvailableTimesResponse {
    courtId: number;
    date: string;
    availableTimes: {
      start: string;
      end: string;
    }[];
  }
  
  export const getAvailableTimes = async (courtId: number): Promise<AvailableTimesResponse> => {
    const endpoint = `api/v1/bookings/${courtId}/available_times`;
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
    if (!token) {
      throw new Error('Usuário não autenticado. Token ausente.');
    }
  
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      // Formata os dados recebidos
      return {
        courtId: result.court_id,
        date: result.date,
        availableTimes: result.available_times.map((time: { start: string; end: string }) => ({
          start: time.start,
          end: time.end,
        })),
      };
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
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

  interface CreateBookingParams {
    startsOn: string; // Formato ISO (exemplo: "2022-11-25T20:00:00Z")
    courtId: number;
    isPublic: boolean;
  }
  
  export const createBooking = async (params: CreateBookingParams): Promise<any> => {
    const endpoint = "api/v1/bookings";
    const token = localStorage.getItem("token"); // Obtenha o token do localStorage
  
    if (!token) {
      throw new Error("Usuário não autenticado. Token ausente.");
    }
  
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token de autenticação no cabeçalho
        },
        body: JSON.stringify({
          starts_on: params.startsOn,
          court_id: params.courtId,
          public: params.isPublic,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erro na requisição: ${error.message || response.statusText}`);
      }
  
      return await response.json(); // Retorna os dados da resposta
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      throw error;
    }
  };
  
  interface PublicBookingResponse {
    data: {
      id: string;
      type: string;
      attributes: {
        starts_on: string;
        ends_on: string;
        total_value: number;
        status: string;
        share_token: string;
        public: boolean;
        user: {
          id: number;
          email: string;
        };
        court: {
          id: number;
          name: string;
          category: string;
          price: number;
        };
        players: any[];
      };
    }[];
  }
  
  export const fetchPublicBookings = async (): Promise<PublicBookingResponse> => {
    const endpoint = `api/v1/bookings?filter[public_eq]=true`;
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
    if (!token) {
      throw new Error('Usuário não autenticado. Token ausente.');
    }
  
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result; // Retorna o resultado como está, o formato já é adequado
    } catch (error) {
      console.error('Erro ao buscar reservas públicas:', error);
      throw error;
    }
  };

  interface UserInformationResponse {
    data: {
      id: string;
      
      
  type: string;
      attributes: {
        email: string;
        name: string;
        document: string;
      };
    };
  }

interface UserInformationResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      email: string;
      name: string;
      document: string;
    };
  };
}

export const fetchUserInformation = async (): Promise<UserInformationResponse> => {
  const endpoint = 'api/v1/informations/me';
  const token = localStorage.getItem('token'); // Obtém o token do localStorage.

  if (!token) {
    throw new Error('Usuário não autenticado. Token ausente.');
  }

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization.
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Retorna o resultado no formato esperado.
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    throw error;
  }
};
