import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';

export const AdminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return from(
    new Promise<boolean>((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        unsubscribe(); // Evita llamadas múltiples
        if (!user) {
          router.navigate(['/admin/login']);
          return resolve(false);
        }

        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data()['role'] === 'admin') {
          return resolve(true);
        }

        router.navigate(['/admin/login']);
        resolve(false);
      });
    })
  );
};
