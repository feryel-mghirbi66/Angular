import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SuggestionService } from '../../../core/Services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit, OnDestroy {

  suggestions: Suggestion[] = [];
  favorites: Suggestion[] = [];
  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.loadSuggestions();

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Only reload when we're back on the list route
      if (event.urlAfterRedirects === '/suggestions') {
        this.loadSuggestions();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadSuggestions(): void {
    this.suggestionService.getSuggestionList().subscribe({
      next: (data: Suggestion[]) => this.suggestions = data,
      error: (err: any) => console.error('Erreur chargement:', err)
    });
  }

  goToDetails(s: Suggestion): void {
    this.router.navigate([s.id], { relativeTo: this.route });
  }

  likeSuggestion(s: Suggestion): void {
    s.nbLikes++;
    this.suggestionService.updateSuggestion(s).subscribe({
      error: (err: any) => {
        s.nbLikes--;
        console.error('Erreur like:', err);
      }
    });
  }

  isInFavorites(s: Suggestion): boolean {
    return this.favorites.some(f => f.id === s.id);
  }

  addToFavorites(s: Suggestion): void {
    if (!this.isInFavorites(s)) {
      this.favorites.push(s);
    }
  }

  removeFromFavorites(s: Suggestion): void {
    this.favorites = this.favorites.filter(f => f.id !== s.id);
  }

  toggleFavorite(s: Suggestion): void {
    this.isInFavorites(s) ? this.removeFromFavorites(s) : this.addToFavorites(s);
  }

  goToAddForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  goToEditForm(id: number): void {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteSuggestion(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette suggestion ?')) return;
    this.suggestionService.deleteSuggestion(id).subscribe({
      next: () => this.loadSuggestions(),
      error: (err: any) => console.error('Erreur suppression:', err)
    });
  }
}