import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/toast/toast-service';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {

  readonly toast = inject(ToastService);

}
