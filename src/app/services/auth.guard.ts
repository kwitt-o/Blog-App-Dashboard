import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { user } from '@angular/fire/auth';
import { filter, map, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // if (authService.isLoggedInGuard) {
  //   console.log('Access Granted');
  //   return true;
  // } else {
  //   toastr.warning('You don`t have permission to access this page');
  //   router.navigate(['/login']);
  //   return false;
  // }

  return authService.$user.pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        // toastr.warning('You don`t have permission to access the page');
        router.navigate(['/login']);
        return false;
      }
    })
  );

  // return authService.$user.pipe(
  // filter(user => user !== undefined),
  // take(1),
  // map(user => {
  //   if (user) {
  //     return true;
  //   } else {
  //     router.navigate(['/login'], { queryParams: { redirected: true } });
  //     return false;
  //   }
  // })
  // );
};
