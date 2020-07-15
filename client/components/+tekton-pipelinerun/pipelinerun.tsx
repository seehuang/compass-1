import "./pipelinerun.scss";

import React, { Fragment } from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { PipelineRun, pipelineRunApi, TaskRun } from "../../api/endpoints";
import { pipelineRunStore } from "./pipelinerun.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { observable } from "mobx";
import { taskRunStore } from "../+tekton-taskrun";
import { TooltipContent } from "../tooltip";
import { StatusBrick } from "../status-brick";
import { cssNames } from "../../utils";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { Notifications } from "../notifications";
import { PipelineRunIcon } from "./pipeline-run-icon";
import { podsStore } from "../+workloads-pods/pods.store";
import Tooltip from "@material-ui/core/Tooltip";
import { PipelineRunVisualDialog } from "./pipelinerun-visual-dialog";
import { tektonGraphStore } from "../+tekton-graph/tekton-graph.store";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { eventStore } from "../+events/event.store";
import { TaskRunLogsDialog } from "../+tekton-taskrun/task-run-logs-dialog";
import { IKubeObjectMetadata } from "../../../client/api/kube-object";
import { advanceSecondsToHms } from "../../api/endpoints";

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  reason = "reason",
  age = "age",
}

interface Props extends RouteComponentProps {}

@observer
export class PipelineRuns extends React.Component<Props> {
  @observable isHiddenPipelineGraph: boolean = true;
  @observable graph: any = null;
  @observable pipelineRun: any;

  renderTasks(pipelineRun: PipelineRun) {
    let names: string[];
    try {
      names = pipelineRunStore.getTaskRunName(pipelineRun);
    } catch {
      names = [];
    }

    if (names.length > 0) {
      // TODO:
      return names.map((item: string) => {
        const taskRun = taskRunStore.getByName(item);
        if (taskRun === undefined) {
          return;
        }
        if (
          taskRun.status?.podName === "" ||
          taskRun.status?.podName === undefined
        ) {
          return;
        }
        //TODO：TypeError: Cannot read property '0' of undefined case page panic
        let status = taskRun?.status?.conditions[0]?.reason;

        if (status === undefined) {
          status = "pending";
        }
        status = status.toLowerCase().toString();
        const name = taskRun.getName();
        const tooltip = (
          <TooltipContent tableView>
            <Fragment>
              <div className="title">
                Name - <span className="text-secondary">{name}</span>
              </div>
              <div className="title">
                LastTransitionTime -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.lastTransitionTime}
                </span>
              </div>
              <div className="title">
                Massage -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.message}
                </span>
              </div>
              <div className="title">
                Reason -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.reason}
                </span>
              </div>
            </Fragment>
          </TooltipContent>
        );
        return (
          <Fragment key={name}>
            <StatusBrick className={cssNames(status)} tooltip={tooltip} />
          </Fragment>
        );
      });
    }
  }

  renderTime(time: string) {
    return (
      <TooltipContent className="PipelineRunTooltip">{time}</TooltipContent>
    );
  }

  renderPipelineName(name: string) {
    return (
      <div>
        <Tooltip title={name} placement="top-start">
          <span>{name}</span>
        </Tooltip>
      </div>
    );
  }

  renderPipelineDuration(startTime: string, completionTime: string) {
    if (completionTime == "" || completionTime == undefined) {
      return;
    }
    const st = new Date(startTime).getTime();
    const ct = new Date(completionTime).getTime();
    let duration = Math.floor((ct - st) / 1000);
    return advanceSecondsToHms(duration);
  }

  renderPipelineStatus(pipelineRun: PipelineRun) {
    //TODO: should fix all pipeline-staus.
    return <Icon material="check_circle_outline" className="pipeline-status" />;
  }

  render() {
    return (
      <>
        <KubeObjectListLayout
          isClusterScoped
          className="PipelineRuns"
          store={pipelineRunStore}
          dependentStores={[
            pipelineStore,
            taskRunStore,
            tektonGraphStore,
            podsStore,
            eventStore,
          ]}
          sortingCallbacks={{
            [sortBy.name]: (pipelineRun: PipelineRun) => pipelineRun.getName(),
            [sortBy.ownernamespace]: (pipelineRun: PipelineRun) =>
              pipelineRun.getOwnerNamespace(),
            [sortBy.reason]: (pipelineRun: PipelineRun) =>
              pipelineRun.getErrorReason(),
            [sortBy.age]: (pipelineRun: PipelineRun) =>
              pipelineRun.getAge(false),
          }}
          onDetails={(pipelineRun: PipelineRun) => {
            PipelineRunVisualDialog.open(pipelineRun);
          }}
          searchFilters={[
            (pipelineRun: PipelineRun) => pipelineRun.getSearchFields(),
          ]}
          renderHeaderTitle={<Trans>PipelineRuns</Trans>}
          renderTableHeader={[
            { title: "Status", className: "" },
            {
              title: <Trans>Name</Trans>,
              className: "name",
              sortBy: sortBy.name,
            },
            {
              title: <Trans>OwnerNamespace</Trans>,
              className: "ownernamespace",
              sortBy: sortBy.ownernamespace,
            },
            { title: "", className: "event" },
            { title: "", className: "reason" },
            { title: <Trans>Tasks</Trans>, className: "tasks" },
            {
              title: <Trans>Created</Trans>,
              className: "age",
              sortBy: sortBy.age,
            },
            { title: <Trans>Duration</Trans>, className: "Duration" },
          ]}
          renderTableContents={(pipelineRun: PipelineRun) => [
            this.renderPipelineStatus(pipelineRun),
            this.renderPipelineName(pipelineRun.getName()),
            pipelineRun.getOwnerNamespace(),
            <KubeEventIcon namespace={"ops"} object={pipelineRun} />,
            pipelineRun.hasIssues() && (
              <PipelineRunIcon object={pipelineRun.status.conditions[0]} />
            ),
            this.renderTasks(pipelineRun),
            `${pipelineRun.getAge()}  ago`,
            this.renderPipelineDuration(
              pipelineRun.status?.startTime.toString(),
              pipelineRun.status?.completionTime.toString()
            ),
          ]}
          renderItemMenu={(item: PipelineRun) => {
            return <PipelineRunMenu object={item} />;
          }}
        />
        <PipelineRunVisualDialog />
        <TaskRunLogsDialog />
      </>
    );
  }
}

export function PipelineRunMenu(props: KubeObjectMenuProps<PipelineRun>) {
  const { object, toolbar } = props;
  return (
    <KubeObjectMenu {...props}>
      <MenuItem
        onClick={() => {
          //Cancel
          let pipelineRun = object;
          pipelineRun.spec.status = "PipelineRunCancelled";
          try {
            // //will update pipelineRun
            pipelineRunStore.update(pipelineRun, { ...pipelineRun });
            Notifications.ok(
              <>PipelineRun {pipelineRun.getName()} cancel succeeded</>
            );
          } catch (err) {
            Notifications.error(err);
          }
        }}
      >
        <Icon material="cancel" title={"cancel"} interactive={toolbar} />
        <span className="title">
          <Trans>Cancel</Trans>
        </span>
      </MenuItem>
      <MenuItem
        onClick={async () => {
          //Cancel
          const pipelineRun = object;
          try {
            // will delete pipelineRun
            await pipelineRunStore.remove(pipelineRun);

            let copyAnnotations = new Map<string, string>();
            pipelineRun.getAnnotations().map((label) => {
              let labelSlice = label.split("=");
              if (labelSlice.length > 0) {
                copyAnnotations.set(labelSlice[0], labelSlice[1]);
              }
            });

            let copyLables = new Map<string, string>();
            pipelineRun.getLabels().map((label) => {
              let labelSlice = label.split("=");
              if (labelSlice.length > 0) {
                copyLables.set(labelSlice[0], labelSlice[1]);
              }
            });

            let newPipelineRun: Partial<PipelineRun> = {
              metadata: {
                name: pipelineRun.getName(),
                namespace: "",
                annotations: Object.fromEntries(copyAnnotations),
                labels: Object.fromEntries(copyLables),
              } as IKubeObjectMetadata,
              spec: {
                pipelineRef: pipelineRun.spec.pipelineRef,
                pipelineSpec: pipelineRun.spec.pipelineSpec,
                resources: pipelineRun.spec.resources,
                params: pipelineRun.spec.params,
                serviceAccountName: pipelineRun.spec.serviceAccountName,
                serviceAccountNames: pipelineRun.spec.serviceAccountNames,
                timeout: pipelineRun.spec.timeout,
                podTemplate: pipelineRun.spec.podTemplate,
              },
            };
            //create it. will re-run
            await pipelineRunStore.create(
              {
                name: pipelineRun.getName(),
                namespace: "",
              },
              { ...newPipelineRun }
            );

            Notifications.ok(
              <>PipelineRun: {pipelineRun.getName()} rerun succeeded</>
            );
          } catch (err) {
            Notifications.error(err);
          }
        }}
      >
        <Icon material="autorenew" title={"rerun"} interactive={toolbar} />
        <span className="title">
          <Trans>Rerun</Trans>
        </span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(pipelineRunApi, { Menu: PipelineRunMenu });
