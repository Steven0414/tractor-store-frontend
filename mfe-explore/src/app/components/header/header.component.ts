import {
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  NgZone,
  OnInit,
  Type,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly vcr = inject(ViewContainerRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly ngZone = inject(NgZone);

  ngOnInit(): void {
    this.ngZone.run(() => this._loadMiniCart());
  }

  private async _loadMiniCart(): Promise<void> {
    try {
      const m = await loadRemoteModule('mfe-checkout', './MiniCart');
      const cmp = m.MiniCartComponent as Type<unknown>;
      this.vcr.createComponent(cmp, { environmentInjector: this.injector });
    } catch (err) {
      console.warn('[Header] MiniCart remote not available:', err);
    }
  }
}
