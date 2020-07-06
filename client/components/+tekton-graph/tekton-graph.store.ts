import {KubeObjectStore} from "../../kube-object.store";
import {autobind} from "../../utils";
import {apiManager} from "../../api/api-manager";
import {TektonGraph, tektonGraphApi} from "../../api/endpoints/tekton-graph.api";

@autobind()
export class TektonGraphStore extends KubeObjectStore<TektonGraph> {
  api = tektonGraphApi
}

export const tektonGraphStore = new TektonGraphStore();
apiManager.registerStore(tektonGraphApi, tektonGraphStore);
