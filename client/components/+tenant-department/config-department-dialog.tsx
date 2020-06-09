import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {computed, observable} from "mobx";
import {
    TenantDepartment,
    tenantDepartmentApi,
    Namespace,
} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Notifications} from "../notifications";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {Select, SelectOption} from "../select";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigDepartmentDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static data: TenantDepartment = null;
    @observable name = "";
    @observable namespaces = observable.array<Namespace>([], {deep: false});
    @observable defaultNamespace = "";

    @computed get selectedNamespaces() {
        return [
            ...this.namespaces,
        ]
    }

    static open(department: TenantDepartment) {
        ConfigDepartmentDialog.isOpen = true;
        ConfigDepartmentDialog.data = department;
    }

    static close() {
        ConfigDepartmentDialog.isOpen = false;
    }

    get department() {
        return ConfigDepartmentDialog.data;
    }

    onOpen = () => {
        this.name = this.department.getName();
        this.namespaces.replace(this.department.spec.namespace)
        this.defaultNamespace = this.department.spec.defaultNamespace
    }

    close = () => {
        ConfigDepartmentDialog.close();
    }

    reset = () => {
        this.name = "";
        this.namespaces.replace([]);
        this.defaultNamespace = "";
    }

    updateDepartment = async () => {
        const {name} = this;
        const department: Partial<TenantDepartment> = {
            spec: {
                namespace: this.selectedNamespaces,
                defaultNamespace: this.defaultNamespace,
            }
        }

        try {
            await tenantDepartmentApi.create({namespace: "kube-system", name: name}, department);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const unwrapNamespaces = (options: SelectOption[]) => options.map(option => option.value);
        const header = <h5><Trans>Config Department</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="ConfigDepartmentDialog"
                isOpen={ConfigDepartmentDialog.isOpen}
                onOpen={this.onOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Apply</Trans>}
                                next={this.updateDepartment}>
                        <div className="namespace">
                            <SubTitle title={<Trans>Namespace</Trans>}/>
                            <NamespaceSelect
                                isMulti
                                value={this.namespaces}
                                placeholder={_i18n._(t`Namespace`)}
                                themeName="light"
                                className="box grow"
                                onChange={(opts: SelectOption[]) => {
                                    if (!opts) opts = [];
                                    this.namespaces.replace(unwrapNamespaces(opts));
                                }}
                            />
                        </div>
                        <div className="default_namespace">
                            <SubTitle title={<Trans>Namespace</Trans>}/>
                            <Select
                                value={this.defaultNamespace}
                                placeholder={_i18n._(t`Default Namespace`)}
                                options={this.namespaces}
                                themeName="light"
                                className="box grow"
                                onChange={value => this.defaultNamespace = value.value}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}