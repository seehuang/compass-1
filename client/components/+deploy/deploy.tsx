import "./deploy.store.ts";

import React from "react";
import {observer} from "mobx-react";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n"
import {RouteComponentProps} from "react-router";
import {t, Trans, select} from "@lingui/macro";
import {Deploy, deployApi} from "../../api/endpoints";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object/kube-object-menu";
import {MainLayout, TabRoute} from "../layout/main-layout";
import {KubeObjectListLayout} from "../kube-object";
import {IDeployWorkloadsParams} from "../+deploy";
import {apiManager} from "../../api/api-manager";
import {deployStore} from "./deploy.store";
import {AddDeployDialog} from "./deploy-dialog";
import {configStore} from "../../config.store"
import {ConfigDeployDialog} from "./config-deploy-dialog";

enum sortBy {
    templateName = "templateName",
    appName = "appName",
    resourceType = "resourceType",
    generateTimestamp = "generateTimestamp",
    age = "age",
}

interface Props extends RouteComponentProps<IDeployWorkloadsParams> {
}

@observer
export class Deploys extends React.Component<Props> {

    render() {
        return (
            <MainLayout>
                <KubeObjectListLayout
                    className="Deploy" store={deployStore}
                    sortingCallbacks={{
                        [sortBy.templateName]: (deploy: Deploy) => deploy.getName(),
                        [sortBy.appName]: (deploy: Deploy) => deploy.getAppName(),
                        [sortBy.resourceType]: (deploy: Deploy) => deploy.getResourceType(),
                        [sortBy.generateTimestamp]: (deploy: Deploy) => deploy.getGenerateTimestamp(),
                        [sortBy.age]: (deploy: Deploy) => deploy.getAge(false),
                    }
                    }

                    searchFilters={
                        [
                            (deploy: Deploy) => deploy.getSearchFields(),
                        ]}

                    renderHeaderTitle={< Trans> Deploys </Trans>}
                    renderTableHeader={
                        [
                            {title: <Trans>AppName</Trans>, className: "appName", sortBy: sortBy.appName},
                            {title: <Trans>TemplateName</Trans>, className: "template", sortBy: sortBy.templateName},
                            {
                                title: <Trans>ResourceType</Trans>,
                                className: "resourceType",
                                sortBy: sortBy.resourceType
                            },
                            {
                                title: <Trans>GenerateTimestamp</Trans>,
                                className: "generateTimestamp",
                                sortBy: sortBy.generateTimestamp
                            },
                            {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                        ]}

                    renderTableContents={(deploy: Deploy) => [
                        deploy.getAppName(),
                        deploy.getName(),
                        deploy.getResourceType(),
                        // new Date( * 1e3).toISOString(),
                        deploy.getGenerateTimestamp(),
                        deploy.getAge(),
                    ]}

                    renderItemMenu={(item: Deploy) => {
                        return <DeployMenu object={item}/>
                    }}

                    addRemoveButtons={{
                        addTooltip: <Trans>AddDeployDialog</Trans>,
                        onAdd: () => AddDeployDialog.open(),
                    }}
                />
                <AddDeployDialog/>
            </MainLayout>
        )
    }
}

export function DeployMenu(props: KubeObjectMenuProps<Deploy>) {
    const {object, toolbar} = props;
    return (
        <>
            <KubeObjectMenu {...props} >
                <MenuItem onClick={() => {ConfigDeployDialog.open(object.getAppName(), object.getName())}}>
                    <Icon material="control_camera" title={_i18n._(t`Deploy`)} interactive={toolbar}/>
                    <span className="title"><Trans>Deploy</Trans></span>
                </MenuItem>
            </KubeObjectMenu>
            <ConfigDeployDialog/>
        </>
    )
}

apiManager.registerViews(deployApi, {
    Menu: DeployMenu,
})
