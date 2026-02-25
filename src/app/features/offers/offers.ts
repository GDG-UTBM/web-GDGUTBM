import { Component, computed, inject, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OffersService, Offer } from './offers.service';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteFooterComponent],
  templateUrl: './offers.html',
  styleUrls: ['./offers.scss']
})
export class OffersComponent implements OnInit {
  private offersService = inject(OffersService);

  offers = this.offersService.getOffersSignal();
  filteredOffers = computed(() => this.applyFilters(this.offers()));

  searchDraft = signal('');
  locationDraft = signal('');
  domainDraft = signal('all');
  typeDraft = signal('all');
  statusDraft = signal('open');
  sortDraft = signal('recent');

  searchTerm = signal('');
  locationFilter = signal('');
  domainFilter = signal('all');
  typeFilter = signal('all');
  statusFilter = signal('open');
  sortBy = signal('recent');

  isLoading = signal(false);

  constructor() {
    this.applyFiltersClick();
  }

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      await this.offersService.loadOffers();
    } finally {
      this.isLoading.set(false);
    }
  }

  totalCount() {
    return this.offers().length;
  }

  remoteCount() {
    return this.offers().filter(offer => offer.mode.toLowerCase().includes('hybride')).length;
  }

  filteredCount() {
    return this.filteredOffers().length;
  }

  applyFiltersClick() {
    this.searchTerm.set(this.searchDraft());
    this.locationFilter.set(this.locationDraft());
    this.domainFilter.set(this.domainDraft());
    this.typeFilter.set(this.typeDraft());
    this.statusFilter.set(this.statusDraft());
    this.sortBy.set(this.sortDraft());
  }

  resetFilters() {
    this.searchDraft.set('');
    this.locationDraft.set('');
    this.domainDraft.set('all');
    this.typeDraft.set('all');
    this.statusDraft.set('open');
    this.sortDraft.set('recent');
    this.applyFiltersClick();
  }

  displayStartDate(offer: Offer) {
    if (offer.startDate) return offer.startDate;
    if (offer.start_date) {
      try {
        return new Date(offer.start_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      } catch {
        return offer.start_date;
      }
    }
    return '';
  }

  private applyFilters(offers: Offer[]) {
    const search = this.searchTerm().trim().toLowerCase();
    const location = this.locationFilter().trim().toLowerCase();
    const domain = this.domainFilter();
    const type = this.typeFilter();
    const status = this.statusFilter();
    const sort = this.sortBy();

    let list = offers.slice();

    if (status !== 'all') {
      list = list.filter(offer => (offer.status || 'open') === status);
    }

    if (search) {
      list = list.filter(offer => {
        const tags = offer.tags.join(' ').toLowerCase();
        return (
          offer.title.toLowerCase().includes(search) ||
          offer.company.toLowerCase().includes(search) ||
          offer.location.toLowerCase().includes(search) ||
          tags.includes(search)
        );
      });
    }

    if (location) {
      list = list.filter(offer => offer.location.toLowerCase().includes(location));
    }

    if (type !== 'all') {
      list = list.filter(offer => offer.type.toLowerCase() === type.toLowerCase());
    }

    if (domain !== 'all') {
      const domainTags = this.domainTags(domain);
      list = list.filter(offer => offer.tags.some(tag => domainTags.includes(tag.toLowerCase())));
    }

    if (sort === 'company') {
      list.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => this.dateValue(b) - this.dateValue(a));
    }

    return list;
  }

  private domainTags(domain: string) {
    const map: Record<string, string[]> = {
      'Tech / Web': ['angular', 'node.js', 'web', 'frontend', 'backend', 'react'],
      'Data / IA': ['python', 'ml', 'data', 'bigquery', 'ai'],
      'Cloud / DevOps': ['docker', 'kubernetes', 'ci/cd', 'cloud', 'devops'],
      'Design / Produit': ['figma', 'design', 'ux', 'product']
    };
    return (map[domain] || []).map(tag => tag.toLowerCase());
  }

  private dateValue(offer: Offer) {
    if (offer.start_date) {
      const time = Date.parse(offer.start_date);
      return Number.isNaN(time) ? 0 : time;
    }
    const time = Date.parse(offer.startDate || '');
    return Number.isNaN(time) ? 0 : time;
  }
}
