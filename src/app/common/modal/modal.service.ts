import { Injectable, Injector, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalOptions } from './modal-options.model';
import { XYZUIConfig } from '../rebirth-ui.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { _throw } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ModalService {

  private instances: any[] = [];

  constructor(private rebirthConfig: XYZUIConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector) {
  }


  showModal<T>(options: ModalOptions): Observable<T> {
    const rootContainer = options.rootContainer || this.rebirthConfig.rootContainer;
    if (!rootContainer) {
      throw new Error('Should setup ViewContainerRef on modal options or rebirth config service!');
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);

    const injector = options.injector || this.injector;
    //const componentFactory: ComponentFactory<ModalComponent> = injector.get(ComponentFactoryResolver).resolveComponentFactory(ModalComponent);

    const modalRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
    this.instances.push(modalRef);
    const instance: ModalComponent = modalRef.instance;
    const dismissResult = instance.addContent(options, this.instances.length)
      .do(() => this.close(modalRef))
      .catch(error => {
        this.close(modalRef);
        return _throw(error);
      });
    instance.open();
    return dismissResult;
  }

  closeAll(): void {
    this.instances.forEach(modalRef => this.close(modalRef));
  }

  private close(modalRef: ComponentRef<ModalComponent>): void {
    this.instances.splice(this.instances.indexOf(modalRef), 1);
    modalRef.instance.close();
    if (!this.instances.length) {
      modalRef.instance.cleanup();
    }
    modalRef.destroy();
  }


}
