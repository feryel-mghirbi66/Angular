import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  isEditMode = false;
  suggestionId!: number;

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
    private route: ActivatedRoute,
    private suggestionService: SuggestionService
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

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.suggestionId = +id;

      this.suggestionService.getSuggestionById(this.suggestionId).subscribe({
        next: (data: Suggestion) => {
          this.suggestionForm.get('status')?.enable();
          this.suggestionForm.patchValue({
            title: data.title,
            description: data.description,
            category: data.category,
            date: new Date(data.date).toISOString().substring(0, 10),
            status: data.status
          });
        },
        error: (err: any) => console.error('Erreur chargement suggestion:', err)
      });
    }
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }

  submit(): void {
    if (this.suggestionForm.invalid) return;

    const formValue = this.suggestionForm.getRawValue();

    const suggestionData: Suggestion = {
      ...formValue,
      id: 0,
      nbLikes: 0
    };

    this.suggestionService.addSuggestion(suggestionData).subscribe({
      next: () => this.router.navigate(['../'], { relativeTo: this.route }),
      error: (err: any) => console.error('Erreur ajout:', err)
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}