import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { user } from '@angular/fire/auth';
import { filter, map, switchMap, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // return authService.$user.pipe(
  //   map(user => {
  //     if (user) {
  //       return true;
  //     } else {
  //       // toastr.warning('You don`t have permission to access the page');
  //       router.navigate(['/login']);
  //       return false;
  //     }
  //   })
  // );

  return authService.authChecked$.pipe(
    // Wait until Firebase has finished checking user auth state
    filter(checked => checked === true),
    take(1),
    switchMap(() => authService.$user.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          toastr.warning('You don`t have permission to access the page');
          router.navigate(['/login']);
          return false;
        }
      })
    ))
  );
};
