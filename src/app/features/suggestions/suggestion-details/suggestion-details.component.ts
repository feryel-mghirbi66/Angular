import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/Services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion: Suggestion | undefined;


  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private suggestionService: SuggestionService  
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (data) => this.suggestion = data,
      error: (err) => console.error('Erreur détails:', err)
    });
  }

  backToList(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  goToUpdate(): void {
    this.router.navigate(['../../add', this.suggestion?.id], { relativeTo: this.route });
  }
}