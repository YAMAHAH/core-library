import {
    Component, OnInit, Input, ElementRef, EventEmitter, Injector, AfterContentInit, ViewChild,
    AfterViewInit, NgZone, Renderer2
} from '@angular/core';
import { UUID } from '@untils/uuid';
import { AppTaskBarActions } from '@framework-actions/app-main-tab/app-main-tab-actions';
import { AppGlobalService } from '@framework-services/AppGlobalService';
import { PurOrderActions, RemovePurOrderAction } from '../../actions/pur/pur-order-actions';
import { FormOptions } from '@framework-components/form/FormOptions';
import { NavTreeNode } from '@framework-components/nav-tree-view/nav-tree-node';
import { styleUntils } from '@untils/style';
import { DynamicFormComponent } from '@framework-dynamic-forms/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@framework-dynamic-forms/models/field-config.interface';
import { Validators } from '@angular/forms';
import { ComponentBase } from '@framework-base/component/ComponentBase';
import { ShowTypeEnum } from '@framework-base/component/ShowTypeEnum';
import { DynamicFormContainerComponent } from '@framework-dynamic-forms/containers/dynamic-form/dynamic-form-container.component';
import { DynamicFormBuilder } from '../../dynamic-form/containers/dynamic-form/DynamicFormBuilder';
import { controlType } from '../../dynamic-form/models/field-config.interface';


@Component({
    selector: 'x-pur-detail',
    host: {
        '[class.flex-column-container-item]': 'true',
        '[class.el-hide]': '!visible && !!!pageModel?.modelRef',
        '[class.el-flex-show]': 'visible && !!pageModel?.modelRef'
    },
    templateUrl: './pur.detail.html'
})
export class PurDetailComponent extends ComponentBase implements OnInit, AfterContentInit, AfterViewInit {

    @ViewChild(DynamicFormComponent) form3: DynamicFormComponent;
    @ViewChild(DynamicFormContainerComponent) form: DynamicFormContainerComponent;
    @ViewChild(DynamicFormBuilder) dynamicFormBuilder: DynamicFormBuilder;
    // @ViewChild(DynamicFormItemComponent) form: DynamicFormItemComponent;

    config: FieldConfig[] = [
        {
            editorType: 'input',
            label: 'Full name',
            name: 'name',
            placeholder: 'Enter your name',
            validation: [Validators.required, Validators.minLength(4)],
            editorOptions: {
                onClick: (event) => console.log('动态绑定组件事件'),
                placeholder: "Enter you name"
            }
        },
        {
            editorType: 'select',
            label: 'Favourite Food',
            name: 'food',
            options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
            placeholder: 'Select an option',
            value: 'Pizza',
            validation: [Validators.required]
        },
        {
            label: 'Submit',
            name: 'submit',
            editorType: 'button'
        }
    ];

    config2: FieldConfig = {
        editorType: 'form',
        name: 'maiform',
        editorOptions: {
            onSubmit: event => console.log(event)
        },
        childs: [
            {
                editorType: 'input',
                label: 'Full name',
                name: 'name',
                placeholder: 'Enter your name',
                validation: [Validators.required, Validators.minLength(4)],
                editorOptions: {
                    onClick: (event) => console.log('动态绑定组件事件'),
                    placeholder: "Enter you name"
                }
            },
            {
                editorType: 'select',
                label: 'Favourite Food',
                name: 'food',
                options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
                placeholder: 'Select an option',
                value: 'Pizza',
                validation: [Validators.required]
            },
            {
                editorType: 'panel',
                name: 'panel1',
                editorOptions: {
                    onClick: e => console.log(e)
                },
                childs: [
                    {
                        editorType: 'input',
                        label: 'Full name2',
                        name: 'name2',
                        placeholder: 'Enter your name2',
                        validation: [Validators.required, Validators.minLength(4)],
                        editorOptions: {
                            onClick: (event) => console.log('动态绑定组件事件2'),
                            placeholder: "Enter you name2"
                        }
                    },
                    {
                        editorType: 'select',
                        label: 'Favourite Food2',
                        name: 'food2',
                        options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
                        placeholder: 'Select an option2',
                        value: 'Knakworstje',
                        validation: [Validators.required]
                    }
                ]
            },
            {
                editorType: 'panel',
                name: 'panel2',
                controlType: 'array',
                editorOptions: {
                    onClick: e => console.log(e)
                },
                childs: [
                    {
                        editorType: 'input',
                        label: 'Full name3',
                        name: 'name3',
                        indexName: '10',
                        placeholder: 'Enter your name2',
                        validation: [Validators.required, Validators.minLength(4)],
                        editorOptions: {
                            onClick: (event) => console.log('动态绑定组件事件2'),
                            placeholder: "Enter you name2"
                        }
                    },
                    {
                        editorType: 'select',
                        label: 'Favourite Food3',
                        name: 'food3',
                        indexName: '12',
                        options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
                        placeholder: 'Select an option2',
                        value: 'Knakworstje',
                        validation: [Validators.required]
                    }
                ]
            },
            {
                editorType: 'panel',
                name: 'panel3',
                controlType: 'array',
                editorOptions: {
                    onClick: e => console.log(e)
                },
                childs: [{
                    editorType: 'panel',
                    name: 'panel4',
                    editorOptions: {
                        onClick: e => console.log(e)
                    },
                    childs: [
                        {
                            editorType: 'input',
                            label: 'Full name4',
                            name: 'name4',
                            placeholder: 'Enter your name4',
                            validation: [Validators.required, Validators.minLength(4)],
                            editorOptions: {
                                onClick: (event) => console.log('动态绑定组件事件2'),
                                placeholder: "Enter you name2"
                            }
                        },
                        {
                            editorType: 'select',
                            label: 'Favourite Food3',
                            name: 'food4',
                            options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
                            placeholder: 'Select an option4',
                            value: 'Knakworstje',
                            validation: [Validators.required]
                        }
                    ]
                },
                {
                    editorType: 'panel',
                    name: 'panel7',
                    controlType: 'array',
                    editorOptions: {
                        onClick: e => console.log(e)
                    },
                    childs: [
                        {
                            editorType: 'input',
                            label: 'Full name7',
                            name: 'name7',
                            placeholder: 'Enter your name7',
                            validation: [Validators.required, Validators.minLength(4)],
                            editorOptions: {
                                onClick: (event) => console.log('动态绑定组件事件7'),
                                placeholder: "Enter you name7"
                            }
                        }]
                },
                {
                    editorType: 'input',
                    label: 'Full name6',
                    name: 'name6',
                    placeholder: 'Enter your name6',
                    validation: [Validators.required, Validators.minLength(4)],
                    editorOptions: {
                        onClick: (event) => console.log('动态绑定组件事件6'),
                        placeholder: "Enter you name6"
                    }
                }]
            },
            {
                label: 'Submit',
                name: 'submit',
                editorType: 'button'
            }
        ]
    };
    config5: FieldConfig[] = [
        {
            editorType: 'group', label: 'group 1', name: 'group 1', childs: [
                {
                    editorType: 'group', label: 'group 2', name: 'group 2', childs: [
                        {
                            editorType: 'group', label: 'group 3', name: 'group 3', childs: [
                                {
                                    editorType: 'input',
                                    label: 'Control 7',
                                    name: 'Control 7',
                                    placeholder: 'Control 7'
                                },
                                {
                                    editorType: 'input',
                                    label: 'Control 8',
                                    name: 'Control 8',
                                    placeholder: 'Control 8'
                                }
                            ]
                        },
                        {
                            editorType: 'input',
                            label: 'Control 5',
                            name: 'Control 5',
                            placeholder: 'Control 5'
                        },
                        {
                            editorType: 'input',
                            label: 'Control 6',
                            name: 'Control 6',
                            placeholder: 'Control 6'
                        }
                    ]
                },
                {
                    editorType: 'input',
                    label: 'Control 3',
                    name: 'Control 3',
                    placeholder: 'Control 3'
                },
                {
                    editorType: 'input',
                    label: 'Control 4',
                    name: 'Control 4',
                    placeholder: 'Control 4'
                }
            ]
        },
        {
            editorType: 'input',
            label: 'Control 1',
            name: 'Control 1',
            placeholder: 'Control 1'
        },
        {
            editorType: 'input',
            label: 'Control 2',
            name: 'Control 2',
            placeholder: 'Control 2'
        },
        {
            editorType: 'group', controlType: 'array', label: 'arrayGroup', name: 'panelArray', childs: [
                {
                    editorType: 'input',
                    label: 'Control 12',
                    name: 'Control12',
                    placeholder: 'Control 12'
                },
                {
                    editorType: 'input',
                    label: 'Control 22',
                    name: 'Control22',
                    placeholder: 'Control 22'
                },
                {
                    editorType: 'group', label: 'arrayGroup2', controlType: 'array', name: 'panelArray2', childs: [
                        {
                            editorType: 'input',
                            label: 'Control 122',
                            name: 'Control122',
                            placeholder: 'Control 122'
                        },
                        {
                            editorType: 'input',
                            label: 'Control 222',
                            name: 'Control222',
                            placeholder: 'Control 222'
                        }
                    ]
                },
                {
                    editorType: 'group', label: 'group5', controlType: 'group', name: 'panelGroup5', childs: [
                        {
                            editorType: 'input',
                            label: 'Control 15',
                            name: 'Control15',
                            placeholder: 'Control 15'
                        },
                        {
                            editorType: 'input',
                            label: 'Control15',
                            name: 'Control15',
                            placeholder: 'Control15'
                        }
                    ]
                }
            ]
        }
    ];
    config6: FieldConfig[] = [
        {
            editorType: 'input',
            label: 'Full name',
            name: 'name',
            placeholder: 'Enter your name',
            validation: [Validators.required, Validators.minLength(4)],
            editorOptions: {
                onClick: (event) => console.log('动态绑定组件事件'),
                placeholder: "Enter you name"
            }
        },
        {
            editorType: 'select',
            label: 'Favourite Food',
            name: 'food',
            options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
            placeholder: 'Select an option',
            value: 'Pizza',
            validation: [Validators.required]
        },
        {
            editorType: 'group',
            name: 'panel1',
            controlType: 'group',
            editorOptions: {
                onClick: e => console.log(e)
            },
            childs: [
                {
                    editorType: 'input',
                    label: 'Full name2',
                    name: 'name2',
                    placeholder: 'Enter your name2',
                    validation: [Validators.required, Validators.minLength(4)],
                    editorOptions: {
                        onClick: (event) => console.log('动态绑定组件事件2'),
                        placeholder: "Enter you name2"
                    }
                },
                {
                    editorType: 'select',
                    label: 'Favourite Food2',
                    name: 'food2',
                    options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
                    placeholder: 'Select an option2',
                    value: 'Knakworstje',
                    validation: [Validators.required]
                }
            ]
        },
        {
            editorType: 'group',
            name: 'panel2',
            controlType: 'array',
            editorOptions: {
                onClick: e => console.log(e)
            },
            childs: [
                {
                    editorType: 'input',
                    label: 'Full name3',
                    name: 'name3',
                    indexName: '10',
                    placeholder: 'Enter your name2',
                    validation: [Validators.required, Validators.minLength(4)],
                    editorOptions: {
                        onClick: (event) => console.log('动态绑定组件事件2'),
                        placeholder: "Enter you name2"
                    }
                },
                {
                    editorType: 'select',
                    label: 'Favourite Food3',
                    name: 'food3',
                    indexName: '12',
                    options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
                    placeholder: 'Select an option2',
                    value: 'Knakworstje',
                    validation: [Validators.required]
                }
            ]
        },
        {
            editorType: 'group',
            name: 'panel3',
            controlType: 'array',
            editorOptions: {
                onClick: e => console.log(e)
            },
            childs: [{
                editorType: 'group',
                name: 'panel4',
                controlType: 'group',
                editorOptions: {
                    onClick: e => console.log(e)
                },
                childs: [
                    {
                        editorType: 'input',
                        label: 'Full name4',
                        name: 'name4',
                        placeholder: 'Enter your name4',
                        validation: [Validators.required, Validators.minLength(4)],
                        editorOptions: {
                            onClick: (event) => console.log('动态绑定组件事件4'),
                            placeholder: "Enter you name2"
                        }
                    },
                    {
                        editorType: 'select',
                        label: 'Favourite Food3',
                        name: 'food4',
                        options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
                        placeholder: 'Select an option4',
                        value: 'Knakworstje',
                        validation: [Validators.required]
                    }
                ]
            },
            {
                editorType: 'group',
                name: 'panel7',
                controlType: 'array',
                editorOptions: {
                    onClick: e => console.log(e)
                },
                childs: [
                    {
                        editorType: 'input',
                        label: 'Full name7',
                        name: 'name7',
                        placeholder: 'Enter your name7',
                        validation: [Validators.required, Validators.minLength(4)],
                        editorOptions: {
                            onClick: (event) => console.log('动态绑定组件事件7'),
                            placeholder: "Enter you name7"
                        }
                    }]
            },
            {
                editorType: 'input',
                label: 'Full name6',
                name: 'name6',
                placeholder: 'Enter your name6',
                validation: [Validators.required, Validators.minLength(4)],
                editorOptions: {
                    onClick: (event) => console.log('动态绑定组件事件6'),
                    placeholder: "Enter you name6"
                }
            }]
        },
        {
            label: 'Submit',
            name: 'submit',
            editorType: 'button'
        }
    ];

    itemConfig = {
        editorType: 'input',
        label: 'Full name20',
        name: 'name20',
        placeholder: 'Enter your name20',
        validation: [Validators.required, Validators.minLength(4)],
        editorOptions: {
            onClick: (event) => console.log('动态绑定组件事件20'),
            placeholder: 'Enter you name6'
        }, childs: []
    };
    ngAfterContentInit(): void {
        // this.setHostElementStyle();

    }
    ngAfterViewInit(): void {
        // if (this.dynamicFormBuilder) {
        //     let previousValid = this.dynamicFormBuilder.valid;
        //     this.dynamicFormBuilder.changes.subscribe((value) => {
        //         if (this.dynamicFormBuilder.valid !== previousValid) {
        //             previousValid = this.dynamicFormBuilder.valid;
        //             this.dynamicFormBuilder.setDisabled('submit', !previousValid);
        //         }
        //     });

        //     this.dynamicFormBuilder.setDisabled('submit', true);
        //     this.dynamicFormBuilder.setControlValue('name', 'Todd Motto');
        //     this.dynamicFormBuilder.patchValue({
        //         name: 'Todd Motto',
        //         panel1: { name2: 'Todd Motto-two' },
        //         panel2: ['YAMAHAH'],
        //         panel3: [{ "name4": "把人都搞晕了", "food4": "Knakworstje" }, ["越搞越复杂"]]
        //     });
        //     console.log(this.dynamicFormBuilder.getControl('panel3.panel4'));
        //     console.log(this.dynamicFormBuilder.getControl('panel3.0'));
        //     console.log(this.dynamicFormBuilder.getControlByKey('panel2'));
        //     this.changeDetectorRef.detectChanges();
        // }
        this.changeDetectorRef.detectChanges();
        if (this.form) {
            let previousValid = this.form.valid;
            this.form.changes.subscribe((value) => {
                if (this.form.valid !== previousValid) {
                    previousValid = this.form.valid;
                    this.form.setDisabled('submit', !previousValid);
                }
            });

            this.form.setDisabled('submit', true);
            this.form.setControlValue('name', 'Todd Motto');
            this.form.patchValue({
                name: 'Todd Motto',
                panel1: { name2: 'Todd Motto-two' },
                panel2: ['YAMAHAH'],
                panel3: [{ "name4": "把人都搞晕了", "food4": "Knakworstje" }, ["越搞越复杂"]]
            });
            this.form.getControl('panel3.0');
            this.changeDetectorRef.detectChanges();
        }

    }
    submit(value: { [name: string]: any }) {
        console.log(value);
    }

    closeBeforeCheckFn: Function;
    @Input() title: string = "采购订单";

    purOrder: any;
    constructor(protected injector: Injector, public renderer: Renderer2, private ngZone: NgZone) {
        super(injector);
    }
    ngOnInit() {

        this.purOrder = { pono: this.pageModel.key, ptnno: "JL-" + UUID.uuid(8, 10) };
        if (this.pageModel.showType === ShowTypeEnum.showForm) {
            this.show();
        }
        if (this.pageModel.showType === ShowTypeEnum.showFormModal) {
            this.showModal();
        }
    }
    autoDisappear = false;
    closed = false;
    closeAlertBox() {
        this.closed = true;
    }

    clickAlertBox(alert: any) {
        console.log(alert);
    }

    appTaskBarActions = new AppTaskBarActions;

    purOrderActions = new PurOrderActions();


    // closeAfterFn: Function = () => {
    //     this.formModel.componentFactoryRef.removePageModel(this.formModel);
    // };
    show(modalOptions?: FormOptions) {
        this.pageModel.title = this.title;
        this.pageModel.elementRef = this.elementRef.nativeElement;
        this.pageModel.closeAfterFn = this.closeAfterFn;
        return this.globalService.navTabManager.show(this.pageModel, modalOptions);
    }
    showModal(modalOptions?: FormOptions) {
        this.pageModel.title = this.title;
        this.pageModel.elementRef = this.elementRef.nativeElement;
        this.pageModel.closeAfterFn = this.closeAfterFn;
        return this.globalService.navTabManager.showModal(this.pageModel, modalOptions);
    }
    setHostElementStyle() {
        let elStyle = ` 
        x-page-viewer {
            display: flex;
            flex: 1 0 auto;
        }
        .el-hide {
            display:none;
        } 
        .el-flex-show { 
            display:flex;flex:1 0 100%;
        }
        `;
        styleUntils.setElementStyle(this.elementRef.nativeElement, elStyle);
    }
    close() {

    }
    hide() {

    }
    ok(event: any) {
        this.modalResult && this.modalResult.emit({ status: 'ok', modalResult: 'ok' });
    }
    cancel(event: any) {
        this.modalResult && this.modalResult.emit({ status: 'cancel', modalResult: 'cancel' });
    }


}