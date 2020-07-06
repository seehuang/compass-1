import { observer } from "mobx-react";
import React from "react";
import { observable, toJS } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Trans } from "@lingui/macro";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Pipeline, PipelineTask } from "../../api/endpoints";
import { Notifications } from "../notifications";
import { PipelineDetails, PipelineResult, pipeline } from "./pipeline-details";
import { pipelineStore } from "./pipeline.store";
import { task } from "./copy-task-dialog";
import { pipelineTaskResource } from "./pipeline-task";
import { taskStore } from "../+tekton-task/task.store";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class PipelineDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable static currentPipeline: Pipeline;
  @observable value: PipelineResult = this.props.value || pipeline;

  static open(pipeline: Pipeline) {
    PipelineDialog.currentPipeline = null;
    PipelineDialog.currentPipeline = pipeline;
    PipelineDialog.isOpen = true;
  }

  get CurrentPipeline() {
    return PipelineDialog.currentPipeline;
  }

  static close() {
    PipelineDialog.isOpen = false;
  }

  close = () => {
    PipelineDialog.close();
  };

  reset = () => {
    this.value.pipelineName = "";
  };

  onOpen = () => {
    this.value.tasks = [];
    let currentPipeline = PipelineDialog.currentPipeline;


    currentPipeline.spec.tasks.map((item, index) => {
      let task = taskStore.getByName(item.name);

      if (task !== undefined) {
        this.value.tasks.push(currentPipeline.spec.tasks[index]);
        if (task.spec.resources.inputs !== undefined) {
          task.spec.resources.inputs.map((task) => {
            currentPipeline.spec.tasks[index].resources.inputs = [];
            currentPipeline.spec.tasks[index].resources.inputs.push({ name: task.name, resource: "" })
          });
          this.value.tasks[index].resources.inputs = [];
          this.value.tasks[index].resources.inputs = currentPipeline.spec.tasks[index].resources.inputs;
        }

        if (task.spec.resources.outputs !== undefined) {
          task.spec.resources.outputs.map((task) => {
            currentPipeline.spec.tasks[index].resources.outputs = [];
            currentPipeline.spec.tasks[index].resources.outputs.push({ name: task.name, resource: "" })
          });

          this.value.tasks[index].resources.outputs = [];
          this.value.tasks[index].resources.outputs = currentPipeline.spec.tasks[index].resources.outputs;
        }
      }

    })

    this.value.tasks.map((item: any, index: number) => {
      if (item.resources === undefined) {
        this.value.tasks[index].resources = pipelineTaskResource;
      }

      if (item.params === undefined) {
        this.value.tasks[index].params = [];
      }
    });

    this.value.pipelineName = currentPipeline.metadata.name;
    const resources = currentPipeline.spec.resources;

    if (currentPipeline.spec.params !== undefined) { this.value.params = currentPipeline.spec.params; }

    if (resources !== undefined) { this.value.resources = resources; }

    if (currentPipeline.spec.workspaces !== undefined) { this.value.workspaces = currentPipeline.spec.workspaces; }
  };

  submit = async () => {


    PipelineDialog.currentPipeline.metadata.name = this.value.pipelineName;

    // pipeline.metadata.namespace = "ops";
    PipelineDialog.currentPipeline.spec.resources = this.value.resources;

    PipelineDialog.currentPipeline.spec.tasks = this.value.tasks;
    PipelineDialog.currentPipeline.spec.params = this.value.params;
    PipelineDialog.currentPipeline.spec.workspaces = this.value.workspaces;
    try {
      // //will update pipeline
      await pipelineStore.update(PipelineDialog.currentPipeline, { ...PipelineDialog.currentPipeline });
      Notifications.ok(<>pipeline {this.value.pipelineName} save successed</>);
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (<h5><Trans>Save Pipeline</Trans></h5>);

    return (
      <Dialog
        isOpen={PipelineDialog.isOpen}
        close={this.close}
        onOpen={this.onOpen}
      >
        <Wizard className="PipelineDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.submit}>
            <PipelineDetails
              value={this.value} onChange={(value) => { this.value = value }}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
