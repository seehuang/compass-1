import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { IPodMetrics, podsApi, PodStatus, pipelineResourceApi, PipelineResource } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class PipelineResourceStore extends KubeObjectStore<PipelineResource> {
  api = pipelineResourceApi
  // @observable metrics: IPodMetrics = null;


  // reset() {
  //   this.metrics = null;
  // }
}

export const pipelineResourceStore = new PipelineResourceStore();
apiManager.registerStore(pipelineResourceApi, pipelineResourceStore);
