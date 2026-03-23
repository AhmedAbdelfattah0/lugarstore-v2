import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HomeStateService } from '../../services/home-state.service';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgOfferBannerComponent } from '../../components/lg-offer-banner/lg-offer-banner.component';
import { LgHeroComponent } from '../../components/lg-hero/lg-hero.component';
import { LgCategoriesSectionComponent } from '../../components/lg-categories-section/lg-categories-section.component';
import { LgPromoBannerComponent } from '../../components/lg-promo-banner/lg-promo-banner.component';
import { LgFeaturedCollectionComponent } from '../../components/lg-featured-collection/lg-featured-collection.component';
import { LgRoomSliderComponent } from '../../components/lg-room-slider/lg-room-slider.component';
import { LgTrustSectionComponent } from '../../components/lg-trust-section/lg-trust-section.component';
import { LgAtelierSectionComponent } from '../../components/lg-atelier-section/lg-atelier-section.component';
import { LgSpinnerComponent } from '../../../../shared/components/ui/lg-spinner/lg-spinner.component';
import { LgQuickViewModalComponent } from '../../../../shared/components/product/lg-quick-view-modal/lg-quick-view-modal.component';

@Component({
  selector: 'lg-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LgNavbarComponent,
    LgFooterComponent,
    LgOfferBannerComponent,
    LgHeroComponent,
    LgCategoriesSectionComponent,
    LgPromoBannerComponent,
    LgFeaturedCollectionComponent,
    LgRoomSliderComponent,
    LgTrustSectionComponent,
    LgAtelierSectionComponent,
    LgSpinnerComponent,
    LgQuickViewModalComponent,
  ],
  templateUrl: './lg-home-page.component.html',
  styleUrl: './lg-home-page.component.scss',
})
export class LgHomePageComponent implements OnInit {
  private readonly meta    = inject(Meta);
  private readonly titleSvc = inject(Title);

  protected readonly state = inject(HomeStateService);

  protected readonly firstFeatured = computed(() => {
    const products = this.state.featuredProducts();
    return products.length > 0 ? products[0] : null;
  });

  ngOnInit(): void {
    this.titleSvc.setTitle('Lugar Furniture — Creating Homes With Character');
    this.meta.updateTag({
      name:    'description',
      content: 'Luxury Egyptian furniture, handcrafted in Cairo. Shop bespoke and ready-made pieces for Egypt and the Gulf.',
    });
    this.meta.updateTag({ property: 'og:title',       content: 'Lugar Furniture — Creating Homes With Character' });
    this.meta.updateTag({ property: 'og:description', content: 'Luxury Egyptian furniture, handcrafted in Cairo.' });
    this.meta.updateTag({ property: 'og:type',        content: 'website' });
  }
}
