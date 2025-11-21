import { User } from "../types";

const USERS_KEY = 'fitlifepro_users_db_v2';

export const authService = {
  register: (email: string, password: string, name: string): User => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.email === email)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const newUser: User = { 
      email, 
      password, // Em um app real, isso seria hashado
      name,
      provider: 'local'
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  login: (email: string, password: string): User => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('E-mail ou senha incorretos.');
    }
    return user;
  },

  loginWithGoogle: async (): Promise<User> => {
    // Simulação de um login com Google bem sucedido
    // Em produção, isso usaria firebase.auth() ou similar
    return new Promise((resolve) => {
      setTimeout(() => {
        const googleUser: User = {
          email: 'usuario.google@gmail.com',
          name: 'Usuário Google',
          provider: 'google',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        };

        // Salvar/Atualizar usuário google no banco local para persistência
        const usersStr = localStorage.getItem(USERS_KEY);
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];
        const existingIndex = users.findIndex(u => u.email === googleUser.email);

        if (existingIndex >= 0) {
          users[existingIndex] = googleUser;
        } else {
          users.push(googleUser);
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        resolve(googleUser);
      }, 1500); // Fake network delay
    });
  },

  // Helpers para salvar dados por usuário (chaveada pelo email)
  getUserData: (email: string, key: string) => {
    return localStorage.getItem(`${email}_${key}`);
  },

  saveUserData: (email: string, key: string, data: any) => {
    localStorage.setItem(`${email}_${key}`, JSON.stringify(data));
  },

  clearUserData: (email: string) => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${email}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
};