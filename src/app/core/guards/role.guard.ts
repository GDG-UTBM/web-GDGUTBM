import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const checkRole = async (route: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const profile = await authService.ensureProfileLoaded();
  if (!profile) return router.parseUrl('/');

  const roles = (route.data?.['roles'] || route.parent?.data?.['roles']) as string[] | undefined;
  if (!roles || roles.length === 0) return true;

  if (profile.role === 'admin') return true;
  if (roles.includes(profile.role)) return true;

  return router.parseUrl('/');
};

export const roleGuard: CanActivateFn = async (route) => checkRole(route);
export const roleChildGuard: CanActivateChildFn = async (route) => checkRole(route);
