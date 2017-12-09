import { ISubject } from '@framework-models/IAction';
export interface reducer {
    subject: ISubject;
    subjectActions: any;
    reducer(): any;
}