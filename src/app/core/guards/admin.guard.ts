import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const profile = await authService.ensureProfileLoaded();

  if (profile && profile.role === 'professional') {
    return true;
  }
  console.log('Admin guard', profile);

  return router.parseUrl('/');
};
