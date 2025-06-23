import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from './environments/environment.prod';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { ImagekitioAngularModule } from 'imagekitio-angular';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Initialize Firebase
  provideFirestore(() => getFirestore()), provideAuth(() => getAuth()), provideAnimations(), provideToastr(), provideHttpClient(), importProvidersFrom(
    ImagekitioAngularModule.forRoot({
      urlEndpoint: 'https://ik.imagekit.io/kwitt',
      publicKey: 'public_j9Q5MuMYw5U55rrTDFU11ahhIk4=',
    })
  ),],
};
