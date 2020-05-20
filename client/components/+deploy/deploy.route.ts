import { RouteProps } from "react-router"
import { buildURL, IURLParams } from "../../navigation";
import { Deploys } from "./deploy";

export const deployRoute: RouteProps = {
  path: "/workloads-template"
}

// Route params
export interface IDeployWorkloadsTemplateParams {
}

// URL-builders
export const deployURL = (params?: IURLParams) => deployWorkloadsTemplateURL(params);
export const deployWorkloadsTemplateURL = buildURL<IDeployWorkloadsTemplateParams>(deployRoute.path)
