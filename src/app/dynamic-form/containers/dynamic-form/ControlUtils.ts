import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

function getControlConfigs(config: FieldConfig[]) {
    return config.filter(({ editorType }) => editorType !== 'button') || [];
}
export function createGroup(config: FieldConfig[], formGroup: FormArray | FormGroup) {
    let group = formGroup;
    if (!formGroup)
        group = new FormGroup({});
    getControlConfigs(config).forEach((item, index) => {
        let control = createControl(item);
        if (group instanceof FormArray) {
            group.push(control);
            item.indexName = group['tag'][item.name] = index.toString();
        } else
            group.addControl(item.name, control);

        if (item.childs && item.childs.length > 0 &&
            (control instanceof FormArray ||
                control instanceof FormGroup))
            createGroup(item.childs, control);
    });
    return group;
}

function createControl(config: FieldConfig) {
    const { validation, asyncValidation, updateOn } = config;
    const extras = {
        validators: validation || [],
        asyncValidators: asyncValidation || [],
        updateOn: updateOn
    };

    if (config.controlType === 'array') {
        let arr = new FormArray([], extras);
        arr['tag'] = {};
        return arr;
    } else if (config.controlType === 'group')
        return new FormGroup({}, extras);
    else {
        const { disabled, validation, value } = config;
        return new FormControl({ disabled, value }, extras);
    }
}