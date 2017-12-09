import {
  Component,
  ComponentRef,
  ViewContainerRef,
  Injector,
  OnDestroy,
  EventEmitter,
  ChangeDetectionStrategy, ComponentFactoryResolver
} from '@angular/core';
import { ModalOptions } from './modal-options.model';
import { Modal } from './modal.model';

@Component({
  selector: 'x-modal-content',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'modalContent'
})
export class ModalContentComponent implements OnDestroy {

  modalContentRef: ComponentRef<Modal>;

  constructor(private modalContentContainer: ViewContainerRef, private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver) {

  }

  addContent<T>(options: ModalOptions, dismiss: EventEmitter<any>) {
    const componentFactoryResolver = options.componentFactoryResolver || this.componentFactoryResolver;
    const componentFactory = componentFactoryResolver.resolveComponentFactory(options.component);
    this.modalContentRef = this.modalContentContainer
      .createComponent(componentFactory, this.modalContentContainer.length, options.injector || this.injector);
    const instance: Modal = this.modalContentRef.instance;
    instance.dismiss = dismiss;
    instance.showTitle = true;
    this.handleResolve(options, instance);
  }

  ngOnDestroy(): void {
    this.modalContentRef.destroy();
  }

  private handleResolve(options: ModalOptions, instance: Modal) {
    const resolve = options.resolve || {};
    if (resolve.then) {
      resolve.then((data: any) => instance.context = data);
    } else if (resolve.subscribe) {
      resolve.subscribe((data: any) => instance.context = data);
    } else {
      instance.context = resolve;
    }
  }
}
