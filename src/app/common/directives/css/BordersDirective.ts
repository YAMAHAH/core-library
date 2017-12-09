import { Directive, OnChanges, SimpleChanges, Input, Renderer2, ElementRef } from '@angular/core';
import { GlobalCSSVariables } from '@framework-services/GlobalCSSVariables';


@Directive({
    selector: ` 
        [gxBorder], [gxBorder0], [gxBorderTop0], [gxBorderRight0], [gxBorderBottom0], [gxBorderLeft0],
        [gxRounded], [gxRoundedTop], [gxRoundedRight], [gxRoundedBottom], [gxRoundedLeft], [gxRoundedCircle],
        [gxBorderWhite], [gxBorderPrimary], [gxBorderSecondary], [gxBorderSuccess], [gxBorderInfo], [gxBorderWarning],
        [gxBorderDanger], [gxBorderLight]`,
    inputs: [
        'gxBorder', 'gxBorder0', 'gxBorderTop0', 'gxBorderRight0', 'gxBorderBottom0', 'gxBorderLeft0',
        'gxRounded', 'gxRoundedTop', 'gxRoundedRight', 'gxRoundedBottom', 'gxRoundedLeft', 'gxRoundedCircle',
        'gxBorderWhite', 'gxBorderPrimary', 'gxBorderSecondary', 'gxBorderSuccess', 'gxBorderInfo', 'gxBorderWarning',
        'gxBorderDanger', 'gxBorderLight']
})
export class BorderDirective implements OnChanges {

    gxBorder: string;
    gxBorder0: string;
    gxBorderTop0: string;
    gxBorderRight0: string;
    gxBorderBottom0: string;
    gxBorderLeft0: string;
    gxBorderWhite: string;
    gxBorderPrimary: string;
    gxBorderSecondary: string;
    gxBorderSuccess: string;
    gxBorderInfo: string;
    gxBorderWarning: string;
    gxBorderDanger: string;
    gxBorderLight: string;

    gxBorderDark: string;

    gxRounded: string;
    gxRoundedTop: string;

    gxRoundedRight: string;

    gxRoundedBottom: string;

    gxRoundedLeft: string;

    gxRoundedCircle: string;
    ;
    constructor(
        private element: ElementRef,
        public renderer: Renderer2,
        private globalCssVar: GlobalCSSVariables) { }
    ngOnChanges(simpleChanges: SimpleChanges) {
        for (const key in simpleChanges) {
            if (simpleChanges.hasOwnProperty(key)) {
                const change = simpleChanges[key];
                switch (key) {
                    case 'gxBorder':
                        this.renderer.setStyle(this.element.nativeElement,
                            'border',
                            `${this.globalCssVar.$border_width} solid ${this.globalCssVar.$border_color}`);
                        break;
                    case 'gxBorder0':
                        this.renderer.setStyle(this.element.nativeElement, 'border', `0`);
                        break;
                    case 'gxBorderTop0':
                        this.renderer.setStyle(this.element.nativeElement, 'border-top', `0`);
                        break;
                    case 'gxBorderRight0':
                        this.renderer.setStyle(this.element.nativeElement, 'border-right', `0`);
                        break;
                    case 'gxBorderBottom0':
                        this.renderer.setStyle(this.element.nativeElement, 'border-bottom', `0`);
                        break;
                    case 'gxBorderLeft0':
                        this.renderer.setStyle(this.element.nativeElement, 'border-left', `0`);
                        break;

                    case 'gxRounded':
                        this.renderer.setStyle(this.element.nativeElement, 'border-radius', `${this.globalCssVar.$border_radius}`);
                        break;
                    case 'gxRoundedTop':
                        this.renderer.setStyle(this.element.nativeElement, 'border-top-left-radius', `${this.globalCssVar.$border_radius}`);
                        this.renderer.setStyle(this.element.nativeElement, 'border-top-right-radius', `${this.globalCssVar.$border_radius}`);
                        break;
                    case 'gxRoundedRight':
                        this.renderer.setStyle(this.element.nativeElement, 'border-top-right-radius', `${this.globalCssVar.$border_radius}`);
                        this.renderer.setStyle(this.element.nativeElement, 'border-bottom-right-radius', `${this.globalCssVar.$border_radius}`);
                        break;
                    case 'gxRoundedBottom':
                        this.renderer.setStyle(this.element.nativeElement, 'border-bottom-left-radius', `${this.globalCssVar.$border_radius}`);
                        this.renderer.setStyle(this.element.nativeElement, 'border-bottom-right-radius', `${this.globalCssVar.$border_radius}`);
                        break;
                    case 'gxRoundedLeft':
                        this.renderer.setStyle(this.element.nativeElement, 'border-top-left-radius', `${this.globalCssVar.$border_radius}`);
                        this.renderer.setStyle(this.element.nativeElement, 'border-bottom-left-radius', `${this.globalCssVar.$border_radius}`);
                        break;
                    case 'gxRoundedCircle':
                        this.renderer.setStyle(this.element.nativeElement, 'border-radius', `50%`);
                        break;
                    case 'gxBorderWhite':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$white}`);
                        break;
                    case 'gxBorderPrimary':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$primary}`);
                        break;
                    case 'gxBorderSecondary':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$secondary}`);
                        break;

                    case 'gxBorderSuccess':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$success}`);
                        break;

                    case 'gxBorderInfo':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$info}`);
                        break;
                    case 'gxBorderWarning':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$warning}`);

                        break;
                    case 'gxBorderDanger':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$danger}`);
                        break;
                    case 'gxBorderLight':
                        this.renderer.setStyle(this.element.nativeElement, 'border-color', `${this.globalCssVar.$light}`);
                        break;

                    default:
                        break;
                }

            }
        }
    }
}