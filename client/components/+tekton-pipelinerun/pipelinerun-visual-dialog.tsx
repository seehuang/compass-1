import "./pipelinerun-visual-dialog.scss"

import React from "react";
import {observable} from "mobx";
import {Trans} from "@lingui/macro";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {observer} from "mobx-react";
import {PipelineRun, Pod} from "../../api/endpoints";
import {graphId, Graphs, initData} from "../+tekton-graph/graphs";
import {taskRunStore} from "../+tekton-taskrun";
import {podsStore} from "../+workloads-pods/pods.store";
import {PodLogsDialog} from "../+workloads-pods/pod-logs-dialog";
import {secondsToHms} from "../../api/endpoints/tekton-graph.api";



interface Props extends Partial<Props> {
}

@observer
export class PipelineRunVisualDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: PipelineRun = null;
  @observable graph: any = null;
  @observable currentNode: any = null;
  @observable timeIntervalID: any = null  ;

  get pipelineRun() {
    return PipelineRunVisualDialog.Data
  }

  static open(obj: PipelineRun) {
    PipelineRunVisualDialog.isOpen = true;
    PipelineRunVisualDialog.Data = obj;
  }

  getTaskRunName(pipelinerun: PipelineRun): string[] {
    if (pipelinerun?.status == undefined) {
      return [];
    }
    if (pipelinerun?.status?.taskRuns == undefined) {
      return [];
    }
    return (
      Object.keys(pipelinerun?.status?.taskRuns).map((item: any) => {
        return item;
      }).slice() || []
    );
  }

  getTaskRun(names: string[]): any {
    let taskMap: any = new Map<string, any>();
    names.map((name: string, index: number) => {
      const currentTask = taskRunStore.getByName(name);
      if (currentTask?.spec !== undefined) {
        taskMap[currentTask.spec.taskRef.name] = currentTask;
      }
    });

    return taskMap;
  }

  showLogs(podName: string) {
    let pod: Pod = podsStore.getByName(podName);
    let container: any = pod.getContainerStatuses();
    PodLogsDialog.open(pod, container);
  }

  showCurrentPipelineRunStatus() {
    //by pipeline ref name get node data
    let nodeData = this.pipelineRun.getPipelineRefNodeData();

    if (nodeData === undefined || nodeData === "") {
    } else {
      this.graph.instance.clear();

      setTimeout(() => { this.graph.instance.changeData(nodeData) }, 200);

      setInterval(() => {
        const names = this.pipelineRun.getTaskRunName();
        if (names.length > 0) {
          const currentTaskRunMap = this.getTaskRun(names);
          nodeData.nodes.map((item: any, index: number) => {
            const currentTaskRun = currentTaskRunMap[item.taskName];
            if (currentTaskRun !== undefined) {
              //should check when the pipeline-run status
              nodeData.nodes[index].status =
                currentTaskRun.status.conditions[0].reason;
            } else {
              nodeData.nodes[index].status = "Pendding";
            }
            nodeData.nodes[index].showtime = true;
          });
          setTimeout(() => {
            this.graph.instance.clear();
            this.graph.instance.changeData(nodeData);
          });
        }
      }, 1000);

      //Interval 1s update status and time in graph
      setInterval(() => {

        const names = this.pipelineRun.getTaskRunName();
        if (names.length > 0) {
          const currentTaskRunMap = this.getTaskRun(names);

          nodeData.nodes.map((item: any, index: number) => {
            // //set current node status,just like:Failed Succeed... and so on.

            const currentTaskRun = currentTaskRunMap[item.taskName];
            if (currentTaskRun !== undefined) {
              //should get current node itme and update the time.
              let currentItem = this.graph.instance.findById(nodeData.nodes[index].id);
              //dynimic set the state: missing notreay
              if (currentTaskRun?.status?.conditions[0]?.reason == undefined) {
                return;
              }

              this.graph.instance.setItemState(
                currentItem,
                currentTaskRun?.status?.conditions[0]?.reason,
                ""
              );

              //when show pipeline will use current date time  less start time and then self-increment。
              let completionTime = currentTaskRun.status.completionTime;
              let totalTime: string;
              const currentStartTime = currentTaskRun.metadata.creationTimestamp;
              const st = new Date(currentStartTime).getTime();
              if (completionTime !== undefined) {
                const ct = new Date(completionTime).getTime();
                let result = Math.floor((ct - st) / 1000);
                totalTime = secondsToHms(result);
              } else {
                const ct = new Date().getTime();
                let result = Math.floor((ct - st) / 1000);
                totalTime = secondsToHms(result);
              }

              //set the time
              this.graph.instance.setItemState(currentItem, "time", totalTime);
            }
          });
        }
      }, 1000);
    }
  }

  onOpen = async () => {
    setTimeout(() => {
      this.graph = new Graphs();
      this.graph.init();

      let nodeData: any = null;
      this.pipelineRun.getAnnotations().filter((item) => {
        const tmp = item.split("=");
        if (tmp[0] == "node_data") {
          nodeData = tmp[1];
        }
      });

      this.graph.instance.clear();
      if (nodeData === undefined || nodeData === "") {
        this.graph.instance.changeData(initData);
      } else {
        setTimeout(() => {
          this.graph.instance.changeData(JSON.parse(nodeData));
        }, 10);
      }

      this.graph.bindClickOnNode((currentNode: any) => {
        const group = currentNode.getContainer();
        let shape = group.get("children")[2];
        const name = shape.attrs.text;

        const names = this.getTaskRunName(this.pipelineRun);
        const currentTaskRunMap = this.getTaskRun(names);
        const currentTaskRun = currentTaskRunMap[name];
        const podName = currentTaskRun.status.podName;
        this.showLogs(podName);

      });
      this.graph.render();

    }, 100)
  }

  static close() {
    PipelineRunVisualDialog.isOpen = false;
  }

  close = () => {
    PipelineRunVisualDialog.close();
  };


  render() {
    const header = (
      <h5>
        <Trans>PipelineRun Visualization</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={PipelineRunVisualDialog.isOpen}
        className="PipelineRunVisualDialog"
        onOpen={this.onOpen}
        close={this.close}>
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" nextLabel={<Trans>Save</Trans>}>
            <div className="container" id={graphId}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }

}