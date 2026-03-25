import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../shared/models/product.model';
import { CartItem } from '../../../../shared/models/cart.model';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LgSectionHeaderComponent } from '../../../../shared/components/layout/lg-section-header/lg-section-header.component';
import { LgProductCardComponent } from '../../../../shared/components/product/lg-product-card/lg-product-card.component';
import { LgButtonComponent } from '../../../../shared/components/ui/lg-button/lg-button.component';

type FilterTab = 'all' | 'new' | 'top' | 'dining' | 'office';

interface Tab {
  key: FilterTab;
  label: string;
}

@Component({
  selector: 'lg-featured-collection',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LgSectionHeaderComponent, LgProductCardComponent, LgButtonComponent],
  templateUrl: './lg-featured-collection.component.html',
  styleUrl: './lg-featured-collection.component.scss',
})
export class LgFeaturedCollectionComponent {
  private readonly cart     = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly toast    = inject(ToastService);

  readonly products = input.required<Product[]>();

  protected readonly activeTab = signal<FilterTab>('all');

  protected readonly tabs: Tab[] = [
    { key: 'all',    label: 'All' },
    { key: 'new',    label: 'New Releases' },
    { key: 'top',    label: 'Best Sellers' },
    { key: 'dining', label: 'Dining' },
    { key: 'office', label: 'Office' },
  ];

  protected readonly filteredProducts = computed(() => {
    const tab      = this.activeTab();
    const products = this.products();
    let result: Product[];
    switch (tab) {
      case 'new':    result = products.filter(p => p.isNew);    break;
      case 'top':    result = products.filter(p => p.isTop);    break;
      case 'dining': result = products.filter(p => p.categoryName?.toLowerCase().includes('dining')); break;
      case 'office': result = products.filter(p => p.categoryName?.toLowerCase().includes('office')); break;
      default:       result = products; break;
    }
    return result.slice(0, 6);
  });

  protected setTab(tab: FilterTab): void {
    this.activeTab.set(tab);
  }

  protected addToCart(product: Product): void {
    const item: CartItem = {
      id:           product.id,
      title:        product.title,
      image:        product.primaryImage,
      qty:          1,
      price:        product.hasDiscount ? product.discountedPrice : product.price,
      categoryName: product.categoryName,
    };
    this.cart.add(item);
    this.toast.show(`${product.title} added to cart`, 'success');
  }

  protected addToWishlist(product: Product): void {
    this.wishlist.toggle({
      id: product.id,
      title: product.title,
      image: product.primaryImage,
      qty: 1,
      price: product.hasDiscount ? product.discountedPrice : product.price,
      categoryName: product.categoryName,
    });
    const isNowWishlisted = this.wishlist.isInWishlist(product.id);
    this.toast.show(
      isNowWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
      'success',
    );
  }
}
