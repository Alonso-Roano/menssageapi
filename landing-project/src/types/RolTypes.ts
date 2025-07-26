export const RoleRouting = {
    Admin: 'dashboard',
    User: 'home',
  }
  export type Roles = 'Admin' | 'User'
  export const enum RolesEnum {
    Admin = 'Admin',
    User = 'User',
  }
  
  export type ResponseRoles = {
    data: {
      role: Roles
    }
  }
  