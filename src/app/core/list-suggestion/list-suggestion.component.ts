import { Component } from '@angular/core';
import { Suggestion } from '../../models/suggestion';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrl: './list-suggestion.component.css'
})
export class ListSuggestionComponent {

 suggestions: Suggestion[] = [
    {
      id: 1,
      title: 'Organiser une journée team building',
      description: 'Suggestion pour organiser une journée de team building pour renforcer les liens entre les membres de l’équipe.',
      category: 'Événements',
      date: new Date('2025-01-20'),
      status: 'acceptée',
      nbLikes: 10
    },
    {
      id: 2,
      title: 'Améliorer le système de réservation',
      description: 'Proposition pour améliorer la gestion des réservations en ligne avec un système de confirmation automatique.',
      category: 'Technologie',
      date: new Date('2025-01-15'),
      status: 'refusée',
      nbLikes: 0
    },
    {
      id: 3,
      title: 'Créer un système de récompenses',
      description: 'Mise en place d’un programme de récompenses pour motiver les employés et reconnaître leurs efforts.',
      category: 'Ressources Humaines',
      date: new Date('2025-01-25'),
      status: 'refusée',
      nbLikes: 5
    },

    {
id: 4,
title: 'Moderniser linterface utilisateur',
description: 'Refonte complète de linterface utilisateur pour une meilleure expérienceutilisateur.',
category: 'Technologie',
date: new Date('2025-01-30'),
status: 'en_attente',
nbLikes:0
}

  ];
  likeSuggestion(s: Suggestion): void {
    s.nbLikes++;
  }
  
  favorites: Suggestion[] = [];
  
  addToFavorites(s: Suggestion): void {
    if (!this.favorites.includes(s)) {
      this.favorites.push(s);
    }
  }

}