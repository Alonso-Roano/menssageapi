interface Perfil {
  id: string;
  nombre: string;
  numero: string;
  foto: string;
  rol?: string;
  fecha_creacion?: string;
  user_id?: any;
}

export type GetPerfilResponse = { success: boolean; data: Perfil };
export type GetPerfilesResponse = { success: boolean; data: Perfil[] };
export type PostPerfilBody = Omit<Perfil, 'id' | 'fecha_creacion' | 'rol'>;
export type PostPerfilResponse = { success: boolean; data: Perfil };
export type PutPerfilBody = Partial<Omit<Perfil, 'id' | 'rol'>>;
export type PutPerfilResponse = { success: boolean; data: Perfil };
export type DeletePerfilResponse = { success: boolean };