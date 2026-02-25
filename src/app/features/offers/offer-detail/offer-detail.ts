import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService, Offer } from '../offers.service';
import { SiteFooterComponent } from '../../../shared/components/site-footer/site-footer';
import { OfferApplicationModalComponent } from '../../../shared/components/offer-application-modal/offer-application-modal';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule, OfferApplicationModalComponent, SiteFooterComponent],
  templateUrl: './offer-detail.html',
  styleUrls: ['./offer-detail.scss']
})
export class OfferDetailComponent implements OnInit {
  offerId = signal<string | null>(null);
  showApplyModal = signal(false);
  offer = computed<Offer | null>(() => {
    const id = this.offerId();
    if (!id) return null;
    return this.offersService.getOfferById(id);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.offerId.set(id);
    this.offersService.fetchOfferById(id).catch(error => console.error(error));
  }

  goBack() {
    this.router.navigate(['/offres']);
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

  openApplyModal() {
    this.showApplyModal.set(true);
  }

  closeApplyModal() {
    this.showApplyModal.set(false);
  }
}
