import React from "react";
import { observer } from "mobx-react";
import { Redirect, Route, Switch } from "react-router";
import { Trans } from "@lingui/macro";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { ConfigMaps, configMapsRoute, configMapsURL } from "../+config-maps";
import { Secrets, secretsRoute, secretsURL } from "../+config-secrets";
import { namespaceStore } from "../+namespaces/namespace.store";
import { resourceQuotaRoute, ResourceQuotas, resourceQuotaURL } from "../+config-resource-quotas";
import { configURL } from "./config.route";
import { HorizontalPodAutoscalers, hpaRoute, hpaURL } from "../+config-autoscalers";
import { Certificates, ClusterIssuers, Issuers } from "../+custom-resources/certmanager.k8s.io";
import { buildURL } from "../../navigation";
import { configStore } from "../../../client/config.store";
import store from 'store'
// Keep
export const certificatesURL = buildURL("/certificates");
export const issuersURL = buildURL("/issuers");
export const clusterIssuersURL = buildURL("/clusterissuers");

@observer
export class Config extends React.Component {
    static get tabRoutes(): TabRoute[] {
        const query = namespaceStore.getContextParams()
        const userConfig = store.get('u_config')
        const isClusterAdmin = userConfig ? userConfig.isClusterAdmin : false
        let items = [
            {
                title: <Trans>ConfigMaps</Trans>,
                component: ConfigMaps,
                url: configMapsURL({ query }),
                path: configMapsRoute.path,
            },
            {
                title: <Trans>Secrets</Trans>,
                component: Secrets,
                url: secretsURL({ query }),
                path: secretsRoute.path,
            },
            {
                title: <Trans>HPA</Trans>,
                component: HorizontalPodAutoscalers,
                url: hpaURL({ query }),
                path: hpaRoute.path,
            },
        ]

        if (isClusterAdmin) {
            items.push({
                title: <Trans>Resource Quotas</Trans>,
                component: ResourceQuotas,
                url: resourceQuotaURL({ query }),
                path: resourceQuotaRoute.path,
            })
        }

        return items;
    }

    render() {
        const tabRoutes = Config.tabRoutes;
        return (
            <MainLayout className="Config" tabs={tabRoutes}>
                <Switch>
                    {tabRoutes.map((route, index) => <Route key={index} {...route} />)}
                    <Redirect to={configURL({ query: namespaceStore.getContextParams() })} />
                </Switch>
            </MainLayout>
        )
    }
}