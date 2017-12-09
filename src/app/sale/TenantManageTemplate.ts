import { TemplateClassBase } from '../Models/template-class';
export class TenantManageTemplate extends TemplateClassBase {

    /** 属性 */
    TemplateId = "c256442e-4c39-a46b-62b3-6e1103d32f57";
    TempName = "TenantManage";
    ModuleId = "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1";
    ModuleName = "MultiTenant";
    /** 数据字段 */
    dataFields = {
        Tenant_Name: {
            objectId: "c256442e-4c39-a46b-62b3-6e1103d32f57", templateId: "c256442e-4c39-a46b-62b3-6e1103d32f57", moduleId: "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1", name: "Name", queryable: true, required: true, visible: true, editable: true, text: "租户名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_IsMaster: {
            name: "IsMaster", queryable: true, required: true, visible: true, editable: true, text: "是否主租户",
            default: "", dataType: "Boolean", componentType: ""
        },
        Tenant_SuperAdminName: {
            name: "SuperAdminName", queryable: true, required: true, visible: true, editable: true, text: "超级管理员名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_CreateTime: {
            name: "CreateTime", queryable: true, required: true, visible: true, editable: false, text: "创建时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_UpdateTime: {
            name: "UpdateTime", queryable: true, required: true, visible: true, editable: true, text: "更新时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_Remark: {
            name: "Remark", queryable: true, required: false, visible: true, editable: true, text: "备注",
            default: "", dataType: "String", componentType: ""
        }
    };
}
export class TenantManageTemplate2 extends TemplateClassBase {

    /** 属性 */
    TemplateId = "c256442e-4c39-a46b-62b3-6e1103d32f57";
    TempName = "TenantManage";
    ModuleId = "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1";
    ModuleName = "MultiTenant";
    /** 数据字段 */
    dataFields = {
        Tenant_Name: {
            objectId: "c256442e-4c39-a46b-62b3-6e1103d32f57", templateId: "c256442e-4c39-a46b-62b3-6e1103d32f57", moduleId: "dfd5eccb-f04e-ce9e-9e28-37235f9e0de1", name: "Name", queryable: true, required: true, visible: true, editable: true, text: "租户名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_IsMaster: {
            name: "IsMaster", queryable: true, required: true, visible: true, editable: true, text: "是否主租户",
            default: "", dataType: "Boolean", componentType: ""
        },
        Tenant_SuperAdminName: {
            name: "SuperAdminName", queryable: true, required: true, visible: true, editable: true, text: "超级管理员名称",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_CreateTime: {
            name: "CreateTime", queryable: false, required: false, visible: false, editable: false, text: "创建时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_UpdateTime: {
            name: "UpdateTime", queryable: true, required: true, visible: true, editable: true, text: "更新时间",
            default: "", dataType: "String", componentType: ""
        },
        Tenant_Remark: {
            name: "Remark", queryable: true, required: false, visible: true, editable: true, text: "备注",
            default: "", dataType: "String", componentType: ""
        }
    };
}
