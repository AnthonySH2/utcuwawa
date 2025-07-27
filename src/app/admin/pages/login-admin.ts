import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup  } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  templateUrl: './login-admin.html',
  styleUrl: './login-admin.scss',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginAdmin {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup;
  error = '';
  loading = false;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async login() {
    this.error = '';
    this.loading = true;

    const { email, password } = this.form.value;

    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);

      // Buscar el documento del usuario en Firestore
      const userDocRef = doc(this.firestore, 'users', cred.user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        this.error = 'Usuario no registrado correctamente.';
        return;
      }

      const data = userSnap.data();
      if (data['role'] !== 'admin') {
        this.error = 'No tienes permisos para acceder al panel.';
        return;
      }

      // Redirigir al panel
      this.router.navigate(['/admin/productos']);
    } catch (err) {
      this.error = 'Correo o contraseña incorrectos.';
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    this.error = '';
    this.loading = true;

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      const user = result.user;
      localStorage.setItem('userPhoto', user.photoURL || '');
      localStorage.setItem('userName', user.displayName || '');

      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        this.error = 'Usuario no registrado como admin.';
        return;
      }

      const data = userSnap.data();
      if (data['role'] !== 'admin') {
        this.error = 'No tienes permisos para ingresar.';
        return;
      }

      this.router.navigate(['/admin/productos']);
    } catch (err: any) {
      console.error(err); // 👈 Agrega esto para ver el error en consola
      this.error = err?.message || 'No se pudo iniciar sesión con Google.';
    }
    finally {
          this.loading = false;
        }
    }
}
