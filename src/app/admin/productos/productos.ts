import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { Firestore, doc, setDoc, collectionData, collection  } from '@angular/fire/firestore';
import {
  TabsComponent,
  TabsListComponent,
  TabsContentComponent,
  TabDirective,
  TabPanelComponent,  
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';

import { NgxDatatableModule,DatatableComponent } from '@swimlane/ngx-datatable';

import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-productos',
  imports: [   
    NgxDatatableModule, 
    TabsComponent,
    TabsListComponent,
    TabsContentComponent,
    TabDirective,
    TabPanelComponent,
    IconDirective,
    CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})

export class Productos implements OnInit{
  @ViewChild(DatatableComponent) table!: DatatableComponent<any>;
  isImporting = false;
  readonly activeItem = signal(0);
  
  productos$!: Observable<any[]>; // observable que se puede usar con async pipe
  productos: any[] = [];
  rows: any[] = [];
  temp: any[] = [];

  esMobile = false;
  dragging = false;
  excelData: any[] = [];
  previewKeys: string[] = [];
  errorMessages: string[] = [];
  importSummary: { success: number; errors: number } | null = null;

  ngOnInit() {
    this.esMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    const productosRef = collection(this.firestore, 'productos'); // nombre de tu colección
    this.productos$ = collectionData(productosRef, { idField: 'id' });

    // Si prefieres obtener los datos una vez:
    this.productos$.subscribe((data) => {
      this.temp = [...data];

      // push our inital complete list
      this.rows = data;
      this.productos = data;
      // console.log('Productos:', this.productos);
    });
  }
  constructor(private firestore: Firestore) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.dragging = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleExcelFile(file);
    }
  }

  handleExcelFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      this.excelData = jsonData;
      this.previewKeys = Object.keys(jsonData[0] || {});
      this.importSummary = null;
      this.errorMessages = [];
    };

    reader.readAsArrayBuffer(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.handleExcelFile(file);
  }

  async importarProductos() {
     if (!this.excelData.length) return;

    this.isImporting = true;
    this.errorMessages = [];
    this.importSummary = null;

    let success = 0;
    let errors = 0;

    for (const [i, row] of this.excelData.entries()) {
      const codigo = row['CODIGO']?.toString().trim();
      const nombre = row['PRODUCTO']?.toString().trim();
      const precioRaw = row['PRECIO'];

      if (!codigo) {
        this.errorMessages.push(`Fila ${i + 2}: Falta el CODIGO`);
        errors++;
        continue;
      }

      if (!nombre || precioRaw === undefined || precioRaw === null || isNaN(Number(precioRaw))) {
        this.errorMessages.push(`Fila ${i + 2}: PRODUCTO o PRECIO inválidos`);
        errors++;
        continue;
      }

      const precio = Number(precioRaw);

      const data: Record<string, any> = {};
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          data[key] = row[key];
        }
      }

      data['CODIGO'] = codigo;

      const ref = doc(this.firestore, `productos/${codigo}`);

      try {
        await setDoc(ref, data, { merge: true });
        success++;
      } catch (e) {
        this.errorMessages.push(`Fila ${i + 2}: Error al subir a Firestore`);
        errors++;
      }
    }

    this.importSummary = { success, errors };
    this.isImporting = false;
  }

  updateFilter(event: KeyboardEvent) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    // filter our data and update the rows
    this.productos = this.temp.filter(function (d) {
      return d.NOMBRE_COMERCIAL.toLowerCase().indexOf(val) !== -1 ||
       d.PRODUCTO.toLowerCase().indexOf(val) !== -1 ||       
       d.TIPO.toLowerCase().indexOf(val) !== -1 || 
       d.CODIGO.toLowerCase().indexOf(val) !== -1 || 
       !val;
    });
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
