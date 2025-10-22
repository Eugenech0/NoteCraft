import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private readonly STORAGE_KEY = 'documents';

  // CRUD операции
  async getDocuments(): Promise<Document[]> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  async getDocument(id: number): Promise<Document | null> {
    const documents = await this.getDocuments();
    return documents.find(doc => doc.id === id) || null;
  }

  async createDocument(documentData: { title: string; content: string }): Promise<Document> {
    const documents = await this.getDocuments();
    
    const newDocument: Document = {
      ...documentData,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    documents.push(newDocument);
    await this.saveDocuments(documents);
    return newDocument;
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | null> {
    const documents = await this.getDocuments();
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) return null;

    documents[index] = {
      ...documents[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.saveDocuments(documents);
    return documents[index];
  }

  async deleteDocument(id: number): Promise<boolean> {
    const documents = await this.getDocuments();
    const filtered = documents.filter(doc => doc.id !== id);
    
    if (filtered.length === documents.length) return false;
    
    await this.saveDocuments(filtered);
    return true;
  }

  private async saveDocuments(documents: Document[]): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(documents)
    });
  }
}