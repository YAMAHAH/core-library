import { Injectable, Renderer2 } from '@angular/core';


@Injectable()
export class GlobalCSSVariables {

    $blue: string = '#007bff';
    $indigo: string = '#6610f2';
    $purple: string = '#6f42c1';
    $pink: string = "#e83e8c";
    $red: string = '#dc3545';
    $orange: string = '#fd7e14';
    $yellow: string = "#ffc107";
    $green: string = "#28a745";
    $teal: string = "#20c997";
    $cyan: string = "#17a2b8";

    $white: string = "#fff";
    $gray_100: string = "#f8f9fa";
    $gray_200: string = "#e9ecef";
    $gray_300: string = "#dee2e6";
    $gray_400: string = "#ced4da";
    $gray_500: string = "#adb5bd";
    $gray_600: string = "#868e96";
    $gray_700: string = "#495057";
    $gray_800: string = "#343a40";
    $gray_900: string = '#212529';
    $black: string = "#000";

    $grays = {
        "100": this.$gray_100,
        "200": this.$gray_200,
        "300": this.$gray_300,
        "400": this.$gray_400,
        "500": this.$gray_500,
        "600": this.$gray_600,
        "700": this.$gray_700,
        "800": this.$gray_800,
        "900": this.$gray_900
    };

    $primary: string = this.$blue;
    $secondary: string = this.$gray_600;
    $success: string = this.$green;
    $info: string = this.$cyan;
    $warning: string = this.$yellow;
    $danger: string = this.$red;
    $light: string = this.$gray_100;
    $dark: string = this.$gray_800;

    $theme_colors = {
        "primary": this.$primary,
        "secondary": this.$secondary,
        "success": this.$success,
        "info": this.$info,
        "warning": this.$warning,
        "danger": this.$danger,
        "light": this.$light,
        "dark": this.$dark
    };

    $theme_color_interval: string = '8%';

    // Customize the light and dark text colors for use in our YIQ color contrast function.
    $yiq_text_dark: string = this.$gray_900;
    $yiq_text_light: string = this.$white;

    $border_width: string = '1px';
    $border_color: string = this.$gray_200;

    $border_radius: string = ".25rem";
    $border_radius_lg: string = ".3rem";
    $border_radius_sm: string = ".2rem";

    $sizes = {
        0: '0 %',
        25: '25 %',
        50: '50 %',
        75: '75 %',
        100: '100 %'
    };

    constructor(public renderer: Renderer2) {
    }

    createElementStyle(target, style: string, renderer: Renderer2) {
        let styleNode = renderer.createElement('style');
        styleNode.innerHTML = style;
        if (target) {
            renderer.appendChild(target, styleNode);
        }
        return () => renderer.removeChild(target, styleNode);
    }
    getElementStyleClass(className: string, classValueMap) {
        let classStyle = "." + className + " { ";
        for (const key in classValueMap) {
            const value = classValueMap[key];
            classStyle += '\n' + key + ' :' + value + ' ;';
        }
        return classStyle += '\n' + '}';
    }

    createStyleClass(target, className: string, classValueMap, renderer: Renderer2) {
        let styleClass = this.getElementStyleClass(className, classValueMap);
        return this.createElementStyle(target, styleClass, renderer);
    }
}
