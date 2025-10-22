import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../services/document.service';
import { Document } from '../models/document';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class HomePage implements OnInit {
  content: string = '';
  title: string = 'Новый документ';
  currentDocument: Document | null = null;

  constructor(private documentService: DocumentService) {}

  async ngOnInit() {
    // Загружаем последний документ или создаем новый
    const documents = await this.documentService.getDocuments();
    if (documents.length > 0) {
      this.currentDocument = documents[documents.length - 1];
      this.title = this.currentDocument.title;
      this.content = this.currentDocument.content;
    }
  }

  async saveDocument() {
    try {
      if (this.currentDocument) {
        // Обновляем существующий документ
        await this.documentService.updateDocument(this.currentDocument.id, {
          title: this.title,
          content: this.content
        });
      } else {
        // Создаем новый документ
        this.currentDocument = await this.documentService.createDocument({
          title: this.title,
          content: this.content
        });
      }
      console.log('Документ сохранен!', this.currentDocument);
      this.showAlert('Успех', 'Документ сохранен!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      this.showAlert('Ошибка', 'Не удалось сохранить документ');
    }
  }

  async newDocument() {
    this.currentDocument = null;
    this.title = 'Новый документ';
    this.content = '';
  }

  private async showAlert(header: string, message: string) {
    // Временное решение - позже заменим на Ionic Alert
    alert(`${header}: ${message}`);
  }
}