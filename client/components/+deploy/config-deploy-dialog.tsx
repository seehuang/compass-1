import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {computed, observable} from "mobx";
import {
    TenantDepartment,
    tenantDepartmentApi,
    Namespace,
    tenantRoleApi, TenantRole, Deploy
} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {SelectOption} from "../select";
import {apiBase} from "../../api";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigDeployDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static appName = "";
    @observable static templateName = "";
    @observable namespace = "";

    static open(appName: string, templateName: string) {
        ConfigDeployDialog.isOpen = true;
        ConfigDeployDialog.appName = appName;
        ConfigDeployDialog.templateName = templateName;
    }

    static close() {
        ConfigDeployDialog.isOpen = false;
    }

    get appName () {
        return ConfigDeployDialog.appName;
    }

    get templateName () {
        return ConfigDeployDialog.templateName;
    }

    close = () => {
        ConfigDeployDialog.close();
    }

    reset = () => {
        ConfigDeployDialog.appName = "";
        ConfigDeployDialog.templateName = "";
        this.namespace = "";
    }

    updateDeploy = async () => {
        const data = {appName: this.appName, templateName:this.templateName, namespace: this.namespace}
        await apiBase.post("/deploy", {data}).then(
            (data) => {
                this.reset();
                this.close();
            }
        )
    }

    render() {
        const {...dialogProps} = this.props;
        const header = <h5><Trans>Deploy</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="ConfigDeployDialog"
                isOpen={ConfigDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>}
                                next={this.updateDeploy}>
                        <div className="namespace">
                            <SubTitle title={<Trans>Namespace</Trans>}/>
                            <NamespaceSelect
                                value={this.namespace}
                                placeholder={_i18n._(t`Namespace`)}
                                themeName="light"
                                className="box grow"
                                onChange={(v) => {this.namespace = v}}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}