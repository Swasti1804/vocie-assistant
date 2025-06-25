export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  joinedDate: string;
  lastLogin: string;
  extensionsGenerated: number;
  accountStatus: 'active' | 'inactive';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}