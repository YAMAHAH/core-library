import { Directive, Input, ElementRef, OnChanges, SimpleChanges, SimpleChange, Renderer2 } from '@angular/core';
import { GlobalCSSVariables } from '@framework-services/GlobalCSSVariables';
@Directive({
    selector: `
        [gxMaxWidth],[gxMaxWidth100],[gxMaxWidth75],[gxMaxWidth50],[gxMaxWidth25],[gxMaxWidth0],
        [gxMaxHeight],[gxMaxHeight100],[gxMaxHeight75],[gxMaxHeight50],[gxMaxHeight25],[gxMaxHeight0],
        [gxWidth],[gxWidth100],[gxWidth75],[gxWidth50],[gxWidth25],[gxWidth0],
        [gxHeight],[gxHeight100],[gxHeight75],[gxHeight50],[gxHeight25],[gxWidth0]
    `
})
export class SizingDirective implements OnChanges {
    @Input() gxMaxHeight: string;
    @Input() gxMaxHeight100: string;
    @Input() gxMaxHeight75: string;
    @Input() gxMaxHeight50: string;
    @Input() gxMaxHeight25: string;
    @Input() gxMaxHeight0: string;

    @Input() gxMaxWidth: string;
    @Input() gxMaxWidth100: string;
    @Input() gxMaxWidth75: string;
    @Input() gxMaxWidth50: string;
    @Input() gxMaxWidth25: string;
    @Input() gxMaxWidth0: string;

    @Input() gxWidth0: string;
    @Input() gxWidth25: string;
    @Input() gxWidth50: string;
    @Input() gxWidth75: string;
    @Input() gxWidth100: string;
    @Input() gxWidth: string;

    @Input() gxHeight0: string;
    @Input() gxHeight25: string;
    @Input() gxHeight50: string;
    @Input() gxHeight75: string;
    @Input() gxHeight100: string;
    @Input() gxHeight: string;

    constructor(private element: ElementRef,
        public renderer: Renderer2,
        private globalCssVar: GlobalCSSVariables) {

    }
    ngOnChanges(simpleChanges: SimpleChanges) {
        for (const key in simpleChanges) {
            if (simpleChanges.hasOwnProperty(key)) {
                const change = simpleChanges[key];

                switch (key) {
                    case 'gxWidth':
                        this.renderer.setStyle(this.element.nativeElement,
                            'width', `${this.gxWidth}`);
                        break;
                    case 'gxWidth100':
                        this.renderer.setStyle(this.element.nativeElement, 'width', `100%`);
                        break;
                    case 'gxWidth75':
                        this.renderer.setStyle(this.element.nativeElement, 'width', `75%`);
                        break;
                    case 'gxWidth50':
                        this.renderer.setStyle(this.element.nativeElement, 'width', '50%');
                        break;
                    case 'gxWidth25':
                        this.renderer.setStyle(this.element.nativeElement, 'width', `25%`);
                        break;
                    case 'gxWidth0':
                        this.renderer.setStyle(this.element.nativeElement, 'width', `0%`);
                        break;

                    case 'gxHeight':
                        this.renderer.setStyle(this.element.nativeElement, 'height', `${this.gxHeight}`);
                        break;
                    case 'gxHeigth100':
                        this.renderer.setStyle(this.element.nativeElement, 'height', `100%`);
                        break;
                    case 'gxHeight75':
                        this.renderer.setStyle(this.element.nativeElement, 'height', `75%`);
                        break;
                    case 'gxHeight50':
                        this.renderer.setStyle(this.element.nativeElement, 'height', `50%`);
                        break;
                    case 'gxHeight25':
                        this.renderer.setStyle(this.element.nativeElement, 'height', `25%`);
                        break;
                    case 'gxHeight0':
                        this.renderer.setStyle(this.element.nativeElement, 'height', `0%`);
                        break;
                    case 'gxMaxWidth':
                        this.renderer.setStyle(this.element.nativeElement, 'max-width', `${this.gxMaxWidth}`);
                        break;
                    case 'gxMaxWidth100':
                        this.renderer.setStyle(this.element.nativeElement, 'max-width', `100%`);
                        break;
                    case 'gxMaxWidth75':
                        this.renderer.setStyle(this.element.nativeElement, 'max-width', `75%`);
                        break;

                    case 'gxMaxWidth50':
                        this.renderer.setStyle(this.element.nativeElement, 'max-width', `50%`);
                        break;

                    case 'gxMaxWidth25':
                        this.renderer.setStyle(this.element.nativeElement, 'max-width', `25%`);
                        break;
                    case 'gxMaxWidth0':
                        this.renderer.setStyle(this.element.nativeElement, 'max-width', `0%`);
                        break;
                    case 'gxMaxHeight':
                        this.renderer.setStyle(this.element.nativeElement, 'max-height', `${this.gxMaxHeight}`);
                        break;
                    case 'gxMaxHeight100':
                        this.renderer.setStyle(this.element.nativeElement, 'max-height', `100%`);
                        break;
                    case 'gxMaxHeight75':
                        this.renderer.setStyle(this.element.nativeElement, 'max-height', `75%`);
                        break;
                    case 'gxMaxHeight50':
                        this.renderer.setStyle(this.element.nativeElement, 'max-height', `50%`);
                        break;
                    case 'gxMaxHeight25':
                        this.renderer.setStyle(this.element.nativeElement, 'max-height', `25%`);
                        break;
                    case 'gxMaxHeight0':
                        this.renderer.setStyle(this.element.nativeElement, 'max-height', `0%`);

                        break;
                    default:
                        break;
                }

            }
        }
    }
}