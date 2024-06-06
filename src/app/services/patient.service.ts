import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../models/patient.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/patients'; // Corriger l'URL de l'API

  constructor(private http: HttpClient) {} // Injecter HttpClient
  
  savePatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/addPatient`, patient); // Corriger l'URL pour ajouter un patient
  }
  
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl); // Utiliser l'URL apiUrl
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  updatePatient(id: number, patientData: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patientData); // Corriger l'URL pour mettre à jour un patient
  }
  
  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Corriger l'URL pour supprimer un patient
  }
}
