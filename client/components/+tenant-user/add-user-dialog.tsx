import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {TenantUser, tenantUserApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {BaseDepartmentSelect} from "../+tenant-department/department-select";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddUserDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddUserDialog.isOpen = true;
    }

    static close() {
        AddUserDialog.isOpen = false;
    }

    @observable name = "";
    @observable namespace = "kube-system";
    @observable display = "";
    @observable email = "";
    @observable department_id = "";

    close = () => {
        AddUserDialog.close();
    }

    reset = () => {
        this.name = "";
        this.email = "";
        this.display = "";
        this.department_id = "";
    }

    createUser = async () => {
        const {name, namespace, department_id, display, email} = this;
        const user: Partial<TenantUser> = {
            spec: {
                name: name,
                display: display,
                email: email,
                password: "",
                department_id: department_id,
            }
        }
        try {
            const newUser = await tenantUserApi.create({namespace, name}, user);
            // showDetails(newUser.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name, display, email} = this;
        const header = <h5><Trans>Create User</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddUserDialog"
                isOpen={AddUserDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createUser}>
                        <div className="tenant-department">
                            <SubTitle title={<Trans>Tenant Department</Trans>}/>
                            <BaseDepartmentSelect
                                placeholder={_i18n._(t`Tenant Department`)}
                                themeName="light"
                                className="box grow"
                                value={this.department_id} onChange={({ value }) => this.department_id = value}
                            />
                        </div>
                        <div className="user-name">
                            <SubTitle title={<Trans>User name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => this.name = v}
                            />
                        </div>
                        <div className="display">
                            <SubTitle title={<Trans>Display</Trans>}/>
                            <Input
                                placeholder={_i18n._(t`Display`)}
                                value={display} onChange={v => this.display = v}
                            />
                        </div>
                        <div className="email">
                            <SubTitle title={<Trans>Email</Trans>}/>
                            <Input
                                placeholder={_i18n._(t`Email`)}
                                value={email} onChange={v => this.email = v}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}