import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z ]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      status: [{ value: 'en_attente', disabled: true }]
    });
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }

  submit(): void {
    if (this.suggestionForm.invalid) return;

    const newSuggestion: Suggestion = {
      id: Date.now(),
      ...this.suggestionForm.getRawValue(),
      nbLikes: 0
    };

    // Store in localStorage to share with list component
    const existing = JSON.parse(localStorage.getItem('suggestions') || '[]');
    existing.push(newSuggestion);
    localStorage.setItem('suggestions', JSON.stringify(existing));

    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}